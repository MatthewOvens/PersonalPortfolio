import { DrawingUtils, FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { GestureModel } from "../models/GestureModel";
import { OneEuroFilter } from "../utils/OneEuroFilter";
import { readScroll, writeScroll } from "../utils/scrollTarget";
import { useEffect, useRef } from "react";

export interface Coordinates {
    x: number;
    y: number;
}

interface GestureComponentProps {
    video: HTMLVideoElement | null
    /**
     * Called on the edges of hand visibility (never per frame). The tutorial
     * uses it to move on as soon as the visitor's hand actually shows up.
     */
    onHandVisibleChange?: (visible: boolean) => void
}

// Pinch-scroll tuning.
// One-Euro filter smooths the tracked fingertip: lower MIN_CUTOFF = steadier
// when slow (less jitter); higher BETA = less lag when moving fast.
const OE_MIN_CUTOFF = 1.0;
const OE_BETA = 0.3;
const OE_DCUTOFF = 1.0;

// Absolute "grab & drag" scrolling: while pinched, the page position tracks the
// hand. SCROLL_GAIN = how many px the page moves per px of hand movement.
const SCROLL_GAIN = 1.0;

// Cap the hand-tracking work to this rate. The MediaPipe recognizer is by far
// the heaviest part of the loop and, on a browser without GPU acceleration, it
// falls back to CPU/software — so running it on every 60fps display frame is
// what makes the skeleton lag on some machines. 30fps still looks smooth and
// roughly halves the cost, independent of the visitor's browser settings.
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

// The fixed top menu is hard to reach with the hand (the palm centre can't
// comfortably get to the very top edge). Instead of moving the cursor, we bring
// the menu to the hand: when the cursor rises into the top band of the viewport
// the navbar drops down (CSS .reachable). Two thresholds (as fractions of the
// viewport height) give hysteresis so the bar doesn't flicker at the boundary:
// it opens once the cursor is above ENTER and only closes again below EXIT.
const MENU_ENTER_RATIO = 0.16;
const MENU_EXIT_RATIO = 0.30;

// How long a link the popup blocker refused stays pending, waiting for a real
// interaction to open it (see followLink).
const PENDING_LINK_TIMEOUT = 15000;

const GestureComponent = (props: GestureComponentProps) => {
    const video = props.video;

    // Mutable state lives in refs so it survives across renders/animation
    // frames and stays reachable from the effect cleanup.
    const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const drawingUtilsRef = useRef<DrawingUtils | null>(null);
    const resultsRef = useRef<any>(undefined);
    const rafIdRef = useRef<number | null>(null);
    // Timestamp of the last processed frame, used to throttle to TARGET_FPS.
    const lastFrameTimeRef = useRef(0);
    const modelRef = useRef<GestureModel>(new GestureModel());

    // Pinch/drag state, kept across animation frames. On grab we record the
    // hand's vertical position and the page's scroll offset; the page is then
    // driven directly from how far the hand has moved since.
    const dragRef = useRef({ isDragging: false, anchorHandY: 0, anchorScrollY: 0 });

    // One-Euro filter for the fingertip's vertical position (drives scrolling).
    const filterRef = useRef({
        y: new OneEuroFilter(OE_MIN_CUTOFF, OE_BETA, OE_DCUTOFF),
    });

    // One-Euro filters for the pointer (palm-centre) position, one per axis.
    const pointerFilterRef = useRef({
        x: new OneEuroFilter(OE_MIN_CUTOFF, OE_BETA, OE_DCUTOFF),
        y: new OneEuroFilter(OE_MIN_CUTOFF, OE_BETA, OE_DCUTOFF),
    });

    // Live pointer state: current screen position + whether a fist is held.
    const pointerRef = useRef({ x: 0, y: 0, fistHeld: false });

    // The on-screen cursor element that follows the hand.
    const cursorRef = useRef<HTMLDivElement>(null);

    // A link whose new tab the browser refused, kept until a real interaction
    // can open it (see followLink), plus the on-screen notice that says so.
    const pendingLinkRef = useRef<{ handler: (event: Event) => void; timer: number } | null>(null);
    const hintRef = useRef<HTMLDivElement>(null);

    // The fixed top navbar (looked up lazily) and whether it's currently dropped
    // down toward the hand, so we only touch the DOM on state changes.
    const navbarElRef = useRef<HTMLElement | null>(null);
    const menuReachableRef = useRef(false);

    // One-time diagnostic flags so we can see where the pipeline stops.
    const videoReadyLoggedRef = useRef(false);
    const firstDetectionLoggedRef = useRef(false);

    // Whether a hand is currently on screen, plus the latest callback. Both live
    // in refs because the detection loop keeps its first closure alive across
    // renders, so reading the prop directly would give a stale value.
    const handVisibleRef = useRef(false);
    const onHandVisibleChangeRef = useRef(props.onHandVisibleChange);
    onHandVisibleChangeRef.current = props.onHandVisibleChange;

    const videoHeight = "100vh";
    const videoWidth = "100vw";

    // Load the model once the webcam is available, then run the detection
    // loop. Cleanup cancels the loop so unmounting (e.g. turning hand
    // navigation off) doesn't leave a stray requestAnimationFrame running.
    useEffect(() => {
        if (!video) return;

        let cancelled = false;

        createGestureRecognizer().then(() => {
            if (cancelled) return;
            rafIdRef.current = requestAnimationFrame(predictWebcam);
        });

        return () => {
            cancelled = true;
            if (rafIdRef.current != null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            clearPendingLink();
            // Hand navigation turned off: leave the navbar in its resting state.
            document.querySelector(".mynavbar")?.classList.remove("reachable");
        };
    }, [video]);

    /**
     * Function to create the gestureRecognizer and initialization of the regions (used to create loops in the music flow)
     */
    const createGestureRecognizer = async () => {
        const recognizer = await loadModelWithRetry();
        if (recognizer) {
            gestureRecognizerRef.current = recognizer;
            console.log("[GestureComponent] GestureRecognizer loaded, starting detection loop.");
        } else {
            console.error("Model loading failed after all retry attempts.");
        }
    }

    async function loadModelWithRetry() {
        let maxRetries = 3; // Maximum number of retry attempts
        let currentRetry = 0;
        let recognizer;

        while (currentRetry < maxRetries) {
            try {
                // Pin the WASM runtime to the installed JS package version so the
                // glue code and the WASM binary stay API-compatible. An unversioned
                // URL resolves to "latest" and can break createFromOptions.
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
                recognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
                    },
                    numHands: 1,
                    runningMode: "VIDEO"
                });
                break; // If loading is successful, exit the loop
            } catch (error) {
                console.error("An error occurred on attempt #" + (currentRetry + 1) + ":", error);
                currentRetry++;

                if (currentRetry >= maxRetries) {
                    console.error("Maximum retry attempts reached. Model loading failed.");
                    break; // Exit the loop if max retries are reached
                }
            }
        }

        return recognizer; // Return the loaded recognizer or undefined if all retries failed
    }


    /**
     * Function to predict gestures from the webcam feed
     */
    const predictWebcam = () => {
        // Keep the loop alive on every display frame, but gate the actual work
        // below by elapsed time so heavy processing runs at most TARGET_FPS.
        rafIdRef.current = requestAnimationFrame(predictWebcam);

        const recognizer = gestureRecognizerRef.current;
        if (!recognizer) return;

        const now = performance.now();
        if (now - lastFrameTimeRef.current < FRAME_INTERVAL) return;
        lastFrameTimeRef.current = now;

        if (setupCanvas()) {
            if (video && video.videoHeight > 0 && video.videoWidth > 0) {
                if (!videoReadyLoggedRef.current) {
                    videoReadyLoggedRef.current = true;
                    console.log(`[GestureComponent] Video ready: ${video.videoWidth}x${video.videoHeight}, running recognition.`);
                }
                try {
                    // performance.now() is monotonic; MediaPipe requires strictly
                    // increasing timestamps, and Date.now() can repeat within a
                    // millisecond and cause frames to be dropped.
                    resultsRef.current = recognizer.recognizeForVideo(video, now);
                } catch (error) {
                    console.error(error);
                }
            }
            drawHands();
            performAction();
        }
    }

    const setupCanvas = () => {
        if (canvasCtxRef.current == null) {
            const el = document.getElementById("output_canvas") as HTMLCanvasElement | null;
            if (!el) return false;
            canvasElementRef.current = el;
            canvasCtxRef.current = el.getContext("2d");
            if (canvasCtxRef.current) {
                // Created once here rather than per frame in drawHands, to avoid
                // a fresh allocation on every rendered frame.
                drawingUtilsRef.current = new DrawingUtils(canvasCtxRef.current);
            }
            el.style.height = videoHeight;
            el.style.width = videoWidth;
        }

        const ctx = canvasCtxRef.current;
        const el = canvasElementRef.current;
        if (!ctx || !el) return false;

        ctx.save();
        ctx.clearRect(0, 0, el.width, el.height);
        return true;
    }

    /**
     * Function to render the user's hands skeleton
     */
    const drawHands = () => {
        const ctx = canvasCtxRef.current;
        const results = resultsRef.current;
        if (!ctx) return;

        const drawingUtils = new DrawingUtils(ctx);
        if (results && results.landmarks) {
            for (const landmarks of results.landmarks) {
                drawingUtils.drawConnectors(
                    landmarks,
                    GestureRecognizer.HAND_CONNECTIONS,
                    {
                        color: "#FFDB58",
                        lineWidth: 5
                    }
                );
                drawingUtils.drawLandmarks(landmarks, {
                    color: "#B01EB0",
                    lineWidth: 10
                });
            }
        }
        ctx.restore();
    }

    /**
     * Function from which all the handles are called.
     *
     * Pinch-to-scroll is derived purely from hand landmarks, so it must run
     * whenever a hand is visible — not only when the model reports a named
     * gesture (a pinch is usually classified as "None", which previously left
     * the scroll handler unreachable). Named-gesture actions still run only
     * when the recognizer actually returns a gesture.
     */
    const performAction = () => {
        const results = resultsRef.current;

        if (!results || !results.landmarks || results.landmarks.length === 0) {
            // No hand on screen: end any in-progress drag and hide the cursor.
            dragRef.current.isDragging = false;
            setHandVisible(false);
            hidePointer();
            return;
        }

        setHandVisible(true);

        if (!firstDetectionLoggedRef.current) {
            firstDetectionLoggedRef.current = true;
            console.log(`[GestureComponent] Hand detected (${results.landmarks.length} hand(s)).`);
        }

        // Only one hand is tracked (numHands: 1).
        const landmarks = results.landmarks[0];
        const handedness = results.handednesses?.[0]?.[0]?.displayName ?? "Right";
        const categoryName = results.gestures?.[0]?.[0]?.categoryName ?? "None";

        // The cursor always follows the hand.
        updatePointer(landmarks);

        if (categoryName === "Closed_Fist") {
            // Fist = click. Don't scroll while clicking.
            dragRef.current.isDragging = false;
            handleFistClick();
        } else {
            releaseFist();
            handleClickGesture(handedness, landmarks);
        }

        detectAction(categoryName, handedness, landmarks);
    }

    /** Report hand visibility upward, but only when it actually changes. */
    const setHandVisible = (visible: boolean) => {
        if (handVisibleRef.current === visible) return;
        handVisibleRef.current = visible;
        onHandVisibleChangeRef.current?.(visible);
    }

    /**
     * Function to detect the specific action returned by the model
     */
    const detectAction = (categoryName: string, handedness: string, landmarks: any) => {
        modelRef.current.updateFSMStates(categoryName, handedness, landmarks, "current_gesture");
    }

    /**
     * Function to handle the click effect which is going to be performed when the user is pinching with their index finger
     */
    const handleClickGesture = (handedness: string, landmarks: any) => {
        if (handedness !== "Right" && handedness !== "Left") return;

        const drag = dragRef.current;
        const filters = filterRef.current;
        const finger = modelRef.current.getFingerPinch(landmarks);

        // Not pinching: release the grab and reset the filter for the next one.
        if (finger !== 'index') {
            drag.isDragging = false;
            filters.y.reset();
            return;
        }

        // Smooth the fingertip's vertical position to remove tracking jitter.
        const now = performance.now();
        const handY = filters.y.filter(landmarks[8].y * window.innerHeight, now);

        // First frame of a pinch: remember where the hand grabbed and where the
        // page was, so movement from here maps to page movement.
        if (!drag.isDragging) {
            drag.isDragging = true;
            drag.anchorHandY = handY;
            drag.anchorScrollY = readScroll();
            return;
        }

        // Absolute "grab & drag": the page tracks the hand in real time. Moving
        // the hand DOWN (handY grows) pulls the content down, i.e. scrolls the
        // page up — and vice versa. Because the scroll target comes from the
        // hand's current position (not a per-frame delta), it neither jitters in
        // place nor lags behind the movement.
        //
        // The write goes through the shared scroll target so the gesture drives
        // whichever container is active: the page normally, or a scrollable
        // overlay such as the tutorial while it's open.
        const target = drag.anchorScrollY - (handY - drag.anchorHandY) * SCROLL_GAIN;
        writeScroll(target);
    }

    /**
     * Move the on-screen cursor to the centre of the palm. The X is mirrored to
     * match the horizontally-flipped skeleton canvas (transform: rotateY(180deg)).
     */
    const updatePointer = (landmarks: any) => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Palm centre = average of the wrist and the four finger-base joints.
        const palm = [0, 5, 9, 13, 17];
        let cx = 0, cy = 0;
        for (const idx of palm) {
            cx += landmarks[idx].x;
            cy += landmarks[idx].y;
        }
        cx /= palm.length;
        cy /= palm.length;

        const now = performance.now();
        const x = pointerFilterRef.current.x.filter((1 - cx) * window.innerWidth, now);
        const y = pointerFilterRef.current.y.filter(cy * window.innerHeight, now);

        pointerRef.current.x = x;
        pointerRef.current.y = y;

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursor.style.display = "block";

        updateMenuReach(y);
    }

    /**
     * Drop the top navbar down toward the hand while the cursor is near the top
     * of the viewport, so its links are reachable without stretching to the very
     * edge. Uses two thresholds for hysteresis (see MENU_ENTER/EXIT_RATIO).
     */
    const updateMenuReach = (y: number) => {
        const wasReachable = menuReachableRef.current;
        const limit = window.innerHeight * (wasReachable ? MENU_EXIT_RATIO : MENU_ENTER_RATIO);
        const reachable = y < limit;
        if (reachable === wasReachable) return;

        menuReachableRef.current = reachable;
        setMenuReachable(reachable);
    }

    /** Toggle the CSS class that drops the navbar down (looked up lazily). */
    const setMenuReachable = (on: boolean) => {
        if (!navbarElRef.current) {
            navbarElRef.current = document.querySelector(".mynavbar");
        }
        navbarElRef.current?.classList.toggle("reachable", on);
    }

    /** Hide the cursor and reset its filters when no hand is visible. */
    const hidePointer = () => {
        const cursor = cursorRef.current;
        if (cursor) {
            cursor.style.display = "none";
            cursor.classList.remove("clicking");
        }
        pointerRef.current.fistHeld = false;
        pointerFilterRef.current.x.reset();
        pointerFilterRef.current.y.reset();

        // Retract the menu when the hand leaves the frame.
        if (menuReachableRef.current) {
            menuReachableRef.current = false;
            setMenuReachable(false);
        }
    }

    /** On the rising edge of a fist, dispatch a real click under the cursor. */
    const handleFistClick = () => {
        const state = pointerRef.current;
        if (state.fistHeld) return; // wait for the hand to open before clicking again

        state.fistHeld = true;
        cursorRef.current?.classList.add("clicking");
        clickAt(state.x, state.y);
    }

    /** Reset the fist state once the hand opens again. */
    const releaseFist = () => {
        if (!pointerRef.current.fistHeld) return;
        pointerRef.current.fistHeld = false;
        cursorRef.current?.classList.remove("clicking");
    }

    /** Dispatch a native click on whatever page element sits under the point. */
    const clickAt = (x: number, y: number) => {
        const target = document.elementFromPoint(x, y) as HTMLElement | null;
        if (!target) return;

        // A link that opens in a new tab needs special handling (see followLink):
        // the browser would silently swallow it, so we suppress the anchor's own
        // navigation and do it ourselves after the click has been delivered.
        const link = target.closest?.("a[href]") as HTMLAnchorElement | null;
        const opensNewTab = !!link && link.target === "_blank";

        const opts: MouseEventInit = { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window };
        target.dispatchEvent(new MouseEvent("mousedown", opts));
        target.dispatchEvent(new MouseEvent("mouseup", opts));

        const suppressNavigation = (event: Event) => event.preventDefault();
        if (opensNewTab) {
            // Capture phase, so it runs before any page handler and cancels the
            // anchor's default action for this one dispatch only.
            window.addEventListener("click", suppressNavigation, true);
        }
        try {
            target.dispatchEvent(new MouseEvent("click", opts));
        } finally {
            window.removeEventListener("click", suppressNavigation, true);
        }

        if (opensNewTab && link) followLink(link);
    }

    /**
     * Open a URL in a new tab. Returns false when the browser refused.
     *
     * No features string is passed, so this is a plain tab like a normal click
     * gives. "noopener" can't go in there: it makes window.open return null even
     * when the tab did open, which would make a refusal impossible to tell apart
     * from a success, so the opener is severed by hand instead.
     */
    const openNewTab = (href: string) => {
        let opened: Window | null = null;
        try {
            opened = window.open(href, "_blank");
        } catch {
            opened = null;
        }
        if (!opened) return false;

        try {
            opened.opener = null;
        } catch {
            // Cross-origin and already isolated; nothing to sever.
        }
        return true;
    }

    /**
     * Follow a target="_blank" link clicked with the hand.
     *
     * The click we dispatch is untrusted, so the page has no user activation and
     * the popup blocker may refuse the tab (this is why LinkedIn did nothing).
     * We still ask for the tab, and when it is refused we hold the link instead
     * of hijacking the current one: the visitor's next real click or key press
     * restores activation and opens it, in a new tab as expected.
     */
    const followLink = (link: HTMLAnchorElement) => {
        const href = link.href;
        if (!href) return;
        if (openNewTab(href)) return;

        queuePendingLink(href);
    }

    /** Hold a refused link until a real interaction can open it. */
    const queuePendingLink = (href: string) => {
        clearPendingLink();

        const handler = () => {
            clearPendingLink();
            openNewTab(href);
        };
        // Capture phase, so the link opens even if the page stops the event.
        window.addEventListener("pointerdown", handler, true);
        window.addEventListener("keydown", handler, true);
        // Let it expire, so a click minutes later doesn't open a tab out of
        // nowhere for a link the visitor has moved on from.
        const timer = window.setTimeout(clearPendingLink, PENDING_LINK_TIMEOUT);
        pendingLinkRef.current = { handler, timer };

        showLinkHint(href);
    }

    /** Drop any held link (opened, or hand navigation turned off). */
    const clearPendingLink = () => {
        const pending = pendingLinkRef.current;
        if (pending) {
            window.removeEventListener("pointerdown", pending.handler, true);
            window.removeEventListener("keydown", pending.handler, true);
            window.clearTimeout(pending.timer);
            pendingLinkRef.current = null;
        }
        showLinkHint(null);
    }

    /** Tell the visitor the tab was blocked, so the click never looks ignored. */
    const showLinkHint = (href: string | null) => {
        const el = hintRef.current;
        if (!el) return;

        if (!href) {
            el.style.display = "none";
            return;
        }

        let label = href;
        try {
            label = new URL(href).hostname.replace(/^www\./, "");
        } catch {
            // Not a parseable URL: fall back to showing it as it is.
        }
        el.textContent = `Your browser blocked the new tab. Click anywhere with your mouse to open ${label}.`;
        el.style.display = "block";
    }

    return (
        <>
            <div ref={cursorRef} className="hand-cursor" />
            <div ref={hintRef} className="hand-link-hint" />
            <div>
                <canvas className="output_canvas" id="output_canvas" width="1920" height="1080" />
            </div>
        </>
    );

}

export default GestureComponent;
