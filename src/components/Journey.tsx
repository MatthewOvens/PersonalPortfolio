import { Fragment, useEffect, useRef } from 'react';
import journeyData, { JourneyTrack } from '../assets/data/JourneyData';
import './Journey.css';

const trackLabels: Record<JourneyTrack, string> = {
  study: 'Education',
  work: 'Experience',
};

const TrackIcon = ({ track }: { track: JourneyTrack }) =>
  track === 'study' ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z"/>
      <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5"/>
      <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z"/>
    </svg>
  );

const Journey = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    // The spine fills as the section travels up the viewport, so the accent
    // line reads as a path being walked rather than a static rule.
    let frame = 0;
    const paint = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Anything above 55% of the viewport counts as already covered.
      const covered = window.innerHeight * 0.55 - rect.top;
      const ratio = Math.min(Math.max(covered / rect.height, 0), 1);
      el.style.setProperty('--spine-progress', `${ratio * 100}%`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // Each entry slides in from its own lane, once.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('isRevealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    el.querySelectorAll('.journeyReveal').forEach((node) => observer.observe(node));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, []);

  return (
    <div className='journeySection'>
      <div className='description'>
        <span className='section-eyebrow'>Background</span>
        <h2 className='section-title'>Education &amp; Experience</h2>
        <p className='section-sub'>What I was studying on the left, what I was building on the right.</p>
      </div>

      <div className='journeyLegend'>
        {(Object.keys(trackLabels) as JourneyTrack[]).map((track) => (
          <span key={track} className={`legendChip ${track}`}>
            <span className='legendDot'><TrackIcon track={track} /></span>
            {trackLabels[track]}
          </span>
        ))}
      </div>

      <div className='journeyTimeline' ref={timelineRef}>
        <span className='journeySpine' aria-hidden="true">
          <span className='journeySpineFill' />
        </span>

        {journeyData.map((entry, index) => (
          <Fragment key={`${entry.start}-${entry.title}`}>
            <div
              className={`journeyMarker journeyReveal revealPop ${entry.track}`}
              style={{ gridRow: index + 1 }}
            >
              <span className='journeyDot'><TrackIcon track={entry.track} /></span>
              <span className='journeyPeriod markerPeriod'>{entry.period}</span>
            </div>

            <article
              className={`journeyCard journeyReveal ${entry.track} ${entry.track === 'study' ? 'revealLeft' : 'revealRight'}`}
              style={{ gridRow: index + 1 }}
            >
              <span className='journeyTag'>{trackLabels[entry.track]}</span>
              <span className='journeyPeriod cardPeriod'>{entry.period}</span>
              <h4 className='journeyTitle'>{entry.title}</h4>
              <div className='journeyOrg'>{entry.org}</div>
              {entry.summary && <p className='journeySummary'>{entry.summary}</p>}
              {entry.details && entry.details.length > 0 && (
                <ul className='journeyDetails'>
                  {entry.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
              {entry.skills && entry.skills.length > 0 && (
                <ul className='journeySkills'>
                  {entry.skills.map((skill) => (
                    <li key={skill} className='journeySkill'>{skill}</li>
                  ))}
                </ul>
              )}
              {entry.link && (
                <a className='journeyLink' href={entry.link.href}>
                  {entry.link.label}
                  <span aria-hidden="true"> →</span>
                </a>
              )}
            </article>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Journey;
