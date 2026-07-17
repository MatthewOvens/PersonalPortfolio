import { DrawingUtils, FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { GestureModel } from "../models/GestureModel";
import { OneEuroFilter } from "../utils/OneEuroFilter";
import { useEffect, useRef } from "react";

export interface Coordinates {
    x: number;
    y: number;
}

interface GestureComponentProps {
    video: HTMLVideoElement | null
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

const GestureComponent = (props: GestureComponentProps) => {
    const video = props.video;

    // Mutable state lives in refs so it survives across renders/animation
    // frames and stays reachable from the effect cleanup.
    const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const resultsRef = useRef<any>(undefined);
    const rafIdRef = useRef<number | null>(null);
    const modelRef = useRef<GestureModel>(new GestureModel());

    // Pinch/drag state, kept across animation frames. On grab we record the
    // hand's vertical position and the page's scroll offset; the page is then
    // driven directly from how far the hand has moved since.
    const dragRef = useRef({ isDragging: false, anchorHandY: 0, anchorScrollY: 0 });

    // One-Euro filters for the fingertip position (one per axis).
    const filterRef = useRef({
        x: new OneEuroFilter(OE_MIN_CUTOFF, OE_BETA, OE_DCUTOFF),
        y: new OneEuroFilter(OE_MIN_CUTOFF, OE_BETA, OE_DCUTOFF),
    });

    // One-time diagnostic flags so we can see where the pipeline stops.
    const videoReadyLoggedRef = useRef(false);
    const firstDetectionLoggedRef = useRef(false);

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
        const recognizer = gestureRecognizerRef.current;
        if (!recognizer) {
            rafIdRef.current = requestAnimationFrame(predictWebcam);
            return;
        }

        if (setupCanvas()) {
            if (video && video.videoHeight > 0 && video.videoWidth > 0) {
                if (!videoReadyLoggedRef.current) {
                    videoReadyLoggedRef.current = true;
                    console.log(`[GestureComponent] Video ready: ${video.videoWidth}x${video.videoHeight}, running recognition.`);
                }
                try {
                    resultsRef.current = recognizer.recognizeForVideo(video, Date.now());
                } catch (error) {
                    console.error(error);
                }
            }
            drawHands();
            performAction();
        }

        rafIdRef.current = requestAnimationFrame(predictWebcam);
    }

    const setupCanvas = () => {
        if (canvasCtxRef.current == null) {
            const el = document.getElementById("output_canvas") as HTMLCanvasElement | null;
            if (!el) return false;
            canvasElementRef.current = el;
            canvasCtxRef.current = el.getContext("2d");
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
            // No hand on screen: end any in-progress drag so the next pinch
            // starts fresh instead of jumping by a huge delta.
            dragRef.current.isDragging = false;
            return;
        }

        if (!firstDetectionLoggedRef.current) {
            firstDetectionLoggedRef.current = true;
            console.log(`[GestureComponent] Hand detected — drawing skeleton (${results.landmarks.length} hand(s)).`);
        }

        for (let i = 0; i < results.landmarks.length; i++) {
            const landmarks = results.landmarks[i];
            const handedness = results.handednesses?.[i]?.[0]?.displayName ?? "Right";

            handleClickGesture(handedness, landmarks);

            const gesture = results.gestures?.[i]?.[0];
            if (gesture) {
                detectAction(gesture.categoryName, handedness, landmarks);
            }
        }
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
            drag.anchorScrollY = window.scrollY;
            return;
        }

        // Absolute "grab & drag": the page tracks the hand in real time. Moving
        // the hand DOWN (handY grows) pulls the content down, i.e. scrolls the
        // page up — and vice versa. Because the scroll target comes from the
        // hand's current position (not a per-frame delta), it neither jitters in
        // place nor lags behind the movement.
        const target = drag.anchorScrollY - (handY - drag.anchorHandY) * SCROLL_GAIN;
        window.scrollTo(0, target);
    }

    return (
        <>
            <div>
                <canvas className="output_canvas" id="output_canvas" width="1920" height="1080" />
            </div>
        </>
    );

}

export default GestureComponent;
