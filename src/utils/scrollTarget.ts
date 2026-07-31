// Shared "active scroll target" for the hand pinch-scroll gesture.
//
// By default the gesture scrolls the whole page (window). When a scrollable
// overlay is open — e.g. the hand-navigation tutorial, which the user scrolls
// through with the very gesture it teaches — it registers its own scroll
// container here so the gesture drives that element instead of the page behind.

let target: HTMLElement | null = null;

/** Register the element the pinch-scroll should drive, or null for the window. */
export const setScrollTarget = (el: HTMLElement | null) => {
    target = el;
};

/** Current scroll offset of the active target (falls back to the window). */
export const readScroll = (): number =>
    target ? target.scrollTop : window.scrollY;

/** Scroll the active target (or the window) to an absolute offset, instantly. */
export const writeScroll = (top: number) => {
    if (target) {
        target.scrollTop = top;
    } else {
        // "instant" overrides the root's smooth scroll-behavior, which would
        // otherwise turn each per-frame scroll into an interrupted animation.
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    }
};
