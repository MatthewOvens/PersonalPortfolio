import { useEffect, useRef, useState } from 'react';
import { setScrollTarget } from '../utils/scrollTarget';
import helloVideo from '../assets/hello animation.mp4';
import pinchVideo from '../assets/pinch animation.mp4';
import clickVideo from '../assets/click animation.mp4';
import './HandNavTutorial.css';

interface HandNavTutorialProps {
  /** True while the webcam is actually tracking a hand. */
  handVisible: boolean;
  /** Close the tutorial. Hand navigation stays on — it's already running. */
  onClose: () => void;
}

/** Pause between "hand detected" and the auto-scroll, so the visitor sees why. */
const ADVANCE_DELAY_MS = 1400;

/** Looping, muted, inline video used as a GIF-style demo for a gesture. */
const GestureClip = ({ src }: { src: string }) => (
  <video className="hnt-video" src={src} autoPlay loop muted playsInline />
);

interface Panel {
  n: string;
  title: string;
  body: string;
  illustration: React.ReactNode;
  hint?: string;
}

const panels: Panel[] = [
  {
    n: '01',
    title: 'Wave at the camera',
    body: 'Hold your open hand up to the webcam, like in the clip, until the skeleton appears.',
    illustration: <GestureClip src={helloVideo} />,
  },
  {
    n: '02',
    title: 'Pinch to scroll',
    body: 'Pinch index finger and thumb together, then move your hand up and down. Try it now!',
    illustration: <GestureClip src={pinchVideo} />,
    hint: 'Keep scrolling for the last step',
  },
  {
    n: '03',
    title: 'Make a fist to click',
    body: 'Move the cursor onto whatever you want, then close your hand into a fist. Try it on the button below.',
    illustration: <GestureClip src={clickVideo} />,
  },
];

const HandNavTutorial = ({ handVisible, onClose }: HandNavTutorialProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  // Latches on the first successful detection: step 1 is done for good, even if
  // the hand later drops out of frame. The ref is what the effect below guards
  // on — reading the state there instead would make the effect re-run the
  // moment it sets it, cancelling its own pending timer.
  const handSeenRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const [handSeen, setHandSeen] = useState(false);

  // On open: register this overlay as the pinch-scroll target, lock the page
  // scroll behind it, and move focus into the dialog — all undone on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    setScrollTarget(scrollRef.current);
    cardRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      setScrollTarget(null);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
      if (advanceTimerRef.current != null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  // Keyboard fallback so the content scrolls like a normal page. The tutorial
  // can only be dismissed via the final button, so Esc intentionally does not
  // close it.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      if (e.key === 'ArrowDown') el.scrollBy({ top: 120, behavior: 'smooth' });
      else if (e.key === 'ArrowUp') el.scrollBy({ top: -120, behavior: 'smooth' });
      else if (e.key === 'PageDown') el.scrollBy({ top: el.clientHeight * 0.9, behavior: 'smooth' });
      else if (e.key === 'PageUp') el.scrollBy({ top: -el.clientHeight * 0.9, behavior: 'smooth' });
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // The first step is the one the visitor can't scroll past on their own: they
  // haven't learnt the pinch yet, and there's no hand to pinch with. So as soon
  // as the webcam actually picks a hand up, the tutorial confirms it and carries
  // them to step 02, where the scroll gesture is taught.
  //
  // The timer deliberately isn't torn down by this effect: once the hand has
  // been seen the move to step 02 is committed, so a hand that flickers out of
  // frame during the delay must not cancel it. Only unmount clears it.
  useEffect(() => {
    if (!handVisible || handSeenRef.current) return;
    handSeenRef.current = true;
    setHandSeen(true);

    advanceTimerRef.current = window.setTimeout(() => {
      const section = sectionRefs.current[1];
      const el = scrollRef.current;
      if (!section || !el) return;
      // Offset within the scroll container, independent of any positioned
      // ancestor that offsetTop would otherwise be measured against.
      const top = section.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
      el.scrollTo({ top, behavior: 'smooth' });
    }, ADVANCE_DELAY_MS);
  }, [handVisible]);

  return (
    <div className="hnt-overlay">
      <div
        className="hnt-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hnt-title"
        tabIndex={-1}
        ref={cardRef}
      >
        {/* Outside the scroll area: it stays put, and — being a fixed height —
            it lets each section below be sized to exactly one viewport. */}
        <header className="hnt-header">
          <span className="hnt-eyebrow">Hand Navigation · Tutorial</span>
          <h2 className="hnt-heading" id="hnt-title">How to navigate with your hand</h2>
        </header>

        <div className="hnt-scroll" ref={scrollRef}>
          <div className="hnt-content">
            {panels.map((p, i) => (
              <section
                className="hnt-section"
                key={p.n}
                aria-label={`${p.n} — ${p.title}`}
                ref={(el) => { sectionRefs.current[i] = el; }}
              >
                <div className="hnt-illustration">{p.illustration}</div>
                <span className="hnt-panel-n">{p.n}</span>
                <h3 className="hnt-panel-title">{p.title}</h3>
                <p className="hnt-panel-body">{p.body}</p>

                {/* Step 01 reports what the camera sees, so the visitor knows
                    whether to keep waving or to expect the auto-scroll. */}
                {i === 0 && (
                  <div
                    className={`hnt-status${handSeen ? ' seen' : ''}`}
                    role="status"
                    aria-live="polite"
                  >
                    <span className="hnt-status-dot" aria-hidden="true" />
                    <span>{handSeen ? 'Hand detected' : 'Looking for your hand…'}</span>
                  </div>
                )}

                {i < panels.length - 1 && p.hint && (
                  <div className="hnt-hint">
                    <span>{p.hint}</span>
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="hnt-chevrons">
                      <path d="M6 9 L12 15 L18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 4 L12 10 L18 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hnt-chevron-2" />
                    </svg>
                  </div>
                )}

                {/* The button belongs to the last step, so the fist gesture has
                    something to aim at without scrolling any further. */}
                {i === panels.length - 1 && (
                  <button className="hnt-cta" onClick={onClose}>
                    Start navigating
                  </button>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandNavTutorial;
