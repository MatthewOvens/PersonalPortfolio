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

/**
 * Scroll the active target (or the window) to an absolute offset, instantly.
 *
 * Both paths must pass "instant" explicitly: the page root and the overlay both
 * set `scroll-behavior: smooth` in CSS, which would otherwise turn every
 * per-frame write into its own smooth animation, each one interrupted by the
 * next. That reads as juddering, and it's why a plain `scrollTop = top`
 * assignment (which obeys the CSS) feels nothing like the main page.
 */
export const writeScroll = (top: number) => {
    const el: Element | Window = target ?? window;
    el.scrollTo({ top, behavior: "instant" as ScrollBehavior });
};
