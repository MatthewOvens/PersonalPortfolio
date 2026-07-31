import { useEffect, useRef } from 'react';
import { setScrollTarget } from '../utils/scrollTarget';
import helloVideo from '../assets/hello animation.mp4';
import pinchVideo from '../assets/pinch animation.mp4';
import clickVideo from '../assets/click animation.mp4';
import './HandNavTutorial.css';

interface HandNavTutorialProps {
  /** Close the tutorial. Hand navigation stays on — it's already running. */
  onClose: () => void;
}

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
    illustration: <GestureClip src={helloVideo} />,
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
