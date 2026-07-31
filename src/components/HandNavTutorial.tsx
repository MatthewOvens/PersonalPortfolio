import { useEffect, useRef } from 'react';
import { setScrollTarget } from '../utils/scrollTarget';
import pinchVideo from '../assets/pinch animation.mp4';
import clickVideo from '../assets/click animation.mp4';
import './HandNavTutorial.css';

interface HandNavTutorialProps {
  /** Close the tutorial. Hand navigation stays on — it's already running. */
  onClose: () => void;
}

/**
 * Base open-hand skeleton, drawn with the exact colours the live tracking uses
 * (yellow bones / magenta joints), so the illustrations match what the visitor
 * actually sees on screen. Each finger is its own group so the panels can
 * animate them independently (draw-in, pinch, curl) via descendant CSS.
 */
const HandSkeleton = () => (
  <>
    <g className="palm">
      <line className="bone" x1="100" y1="175" x2="72" y2="108" />
      <line className="bone" x1="100" y1="175" x2="96" y2="100" />
      <line className="bone" x1="100" y1="175" x2="120" y2="104" />
      <line className="bone" x1="100" y1="175" x2="142" y2="116" />
      <line className="bone" x1="100" y1="175" x2="60" y2="140" />
      <path className="bone" d="M72 108 L96 100 L120 104 L142 116" />
      <circle className="joint" cx="100" cy="175" r="6" />
      <circle className="joint" cx="72" cy="108" r="5" />
      <circle className="joint" cx="96" cy="100" r="5" />
      <circle className="joint" cx="120" cy="104" r="5" />
      <circle className="joint" cx="142" cy="116" r="5" />
      <circle className="joint" cx="60" cy="140" r="5" />
    </g>

    <g className="finger f-thumb">
      <line className="bone" x1="60" y1="140" x2="46" y2="125" />
      <line className="bone" x1="46" y1="125" x2="32" y2="110" />
      <circle className="joint" cx="46" cy="125" r="4" />
      <circle className="joint tip-thumb" cx="32" cy="110" r="5" />
    </g>

    <g className="finger f-index">
      <line className="bone" x1="72" y1="108" x2="69" y2="74" />
      <line className="bone" x1="69" y1="74" x2="66" y2="40" />
      <circle className="joint" cx="69" cy="74" r="4" />
      <circle className="joint tip-index" cx="66" cy="40" r="5" />
    </g>

    <g className="finger f-middle">
      <line className="bone" x1="96" y1="100" x2="96" y2="66" />
      <line className="bone" x1="96" y1="66" x2="96" y2="32" />
      <circle className="joint" cx="96" cy="66" r="4" />
      <circle className="joint" cx="96" cy="32" r="5" />
    </g>

    <g className="finger f-ring">
      <line className="bone" x1="120" y1="104" x2="122" y2="73" />
      <line className="bone" x1="122" y1="73" x2="124" y2="42" />
      <circle className="joint" cx="122" cy="73" r="4" />
      <circle className="joint" cx="124" cy="42" r="5" />
    </g>

    <g className="finger f-pinky">
      <line className="bone" x1="142" y1="116" x2="146" y2="94" />
      <line className="bone" x1="146" y1="94" x2="150" y2="72" />
      <circle className="joint" cx="146" cy="94" r="4" />
      <circle className="joint" cx="150" cy="72" r="5" />
    </g>
  </>
);

/** Step 1 — the skeleton draws itself in, mirroring the ~1s warm-up. */
const WaitIllustration = () => (
  <svg className="hnt-hand draw" viewBox="0 0 200 210" aria-hidden="true">
    <HandSkeleton />
    <g className="loading-dots">
      <circle cx="82" cy="200" r="4" />
      <circle cx="100" cy="200" r="4" />
      <circle cx="118" cy="200" r="4" />
    </g>
  </svg>
);

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
    title: 'Attendi la tua mano',
    body: 'La webcam si sta avviando. Tra circa un secondo lo scheletro della tua mano comparirà sullo schermo e comincerà a seguire ogni tuo movimento.',
    illustration: <WaitIllustration />,
    hint: 'Fai il pinch e scorri verso il basso',
  },
  {
    n: '02',
    title: 'Pinch per scorrere',
    body: 'Unisci indice e pollice come per pizzicare la pagina, poi muovi la mano su e giù per scorrere. Provalo adesso: è così che sei arrivato fin qui.',
    illustration: <GestureClip src={pinchVideo} />,
    hint: 'Continua a scorrere per l’ultimo passo',
  },
  {
    n: '03',
    title: 'Pugno per cliccare',
    body: 'Porta il cursore su ciò che vuoi selezionare e chiudi la mano a pugno: equivale a un click. Provalo subito sul pulsante qui sotto per iniziare.',
    illustration: <GestureClip src={clickVideo} />,
  },
];

const HandNavTutorial = ({ onClose }: HandNavTutorialProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
        <div className="hnt-scroll" ref={scrollRef}>
          <div className="hnt-content">
            <header className="hnt-header">
              <span className="hnt-eyebrow">Hand Navigation · Tutorial</span>
              <h2 className="hnt-heading" id="hnt-title">Come si naviga con la mano</h2>
            </header>

            {panels.map((p, i) => (
              <section className="hnt-section" key={p.n} aria-label={`${p.n} — ${p.title}`}>
                <div className="hnt-illustration">{p.illustration}</div>
                <span className="hnt-panel-n">{p.n}</span>
                <h3 className="hnt-panel-title">{p.title}</h3>
                <p className="hnt-panel-body">{p.body}</p>

                {i < panels.length - 1 && p.hint && (
                  <div className="hnt-hint">
                    <span>{p.hint}</span>
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="hnt-chevrons">
                      <path d="M6 9 L12 15 L18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 4 L12 10 L18 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hnt-chevron-2" />
                    </svg>
                  </div>
                )}
              </section>
            ))}

            <button className="hnt-cta" onClick={onClose}>
              Inizia a navigare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandNavTutorial;
