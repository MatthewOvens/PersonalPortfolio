import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';
import { ProjectChapter, ProjectData } from '../assets/data/ProjectsData';
import { formatProjectDate } from '../utils/projectDates';
import { setScrollTarget } from '../utils/scrollTarget';
import { renderRichText } from '../utils/richText';
import Flag from './Flag';
import './ProjectDialog.css';

interface ProjectDialogProps {
    show: boolean;
    onHide: () => void;
    projectData: ProjectData | null;
}

/** Every project is told through the same three chapters, in the same order. */
const chapters: { key: 'concept' | 'how' | 'learnings'; label: string; hint: string }[] = [
    { key: 'concept', label: 'Concept', hint: 'The idea behind it' },
    { key: 'how', label: 'How', hint: 'The way it was built' },
    { key: 'learnings', label: 'Learnings', hint: 'What I took away' },
];

const Chapter = ({
    index,
    label,
    hint,
    chapter,
}: {
    index: number;
    label: string;
    hint: string;
    chapter: ProjectChapter;
}) => (
    // The delay staggers the chapters as the dialog opens, in the same spirit as
    // the timeline reveal in the Journey section.
    //
    // Two columns over two rows: the head sits alone on the first row, the text
    // and the image share the second, so the image starts level with the top of
    // the text rather than with the title. Chapters without an image get a
    // narrow rail and let the text span both rows, back up against the head.
    <section
        className={`projectChapter${chapter.image ? '' : ' chapterNoFigure'}`}
        style={{ animationDelay: `${120 + index * 90}ms` }}
    >
        <header className='chapterHead'>
            <span className='chapterIndex'>{String(index + 1).padStart(2, '0')}</span>
            <div>
                <h3 className='chapterLabel'>{label}</h3>
                <span className='chapterHint'>{hint}</span>
            </div>
        </header>

        <div className='chapterText'>
            <p className='chapterParagraph'>{renderRichText(chapter.text)}</p>
            {chapter.points && chapter.points.length > 0 && (
                <ul className='chapterPoints'>
                    {chapter.points.map((point) => (
                        <li key={point}>{renderRichText(point)}</li>
                    ))}
                </ul>
            )}
        </div>

        {chapter.image && (
            <figure className='chapterFigure'>
                <img src={chapter.image} alt={`${label} — illustration`} loading='lazy' />
            </figure>
        )}
    </section>
);

const ProjectDialog = ({ show, onHide, projectData }: ProjectDialogProps) => {
    // While the dialog is open it — not the page — is what the pinch-scroll
    // gesture has to drive: Bootstrap locks the body scroll behind an open
    // modal, so a hand scroll aimed at the window would simply do nothing.
    // `.projectModal` (the overlay) is the element that actually scrolls; see
    // the note on `scrollable` below.
    //
    // Declared before the early return below so the hook order never changes.
    useEffect(() => {
        if (!show) return;
        setScrollTarget(document.querySelector<HTMLElement>('.projectModal'));
        return () => setScrollTarget(null);
    }, [show]);

    if (!projectData) return null;

    // Keyed by role rather than by value: the location now carries a flag
    // alongside its text, so the item is no longer a plain string.
    const meta = [
        { key: 'date', node: formatProjectDate(projectData.date) },
        ...(projectData.role ? [{ key: 'role', node: projectData.role }] : []),
        {
            key: 'location',
            node: (
                <>
                    <Flag country={projectData.country} className='flagOnDark' />
                    {projectData.location}
                </>
            ),
        },
    ];

    return (
        <Modal
            show={show}
            onHide={onHide}
            size='xl'
            centered
            // No `scrollable`: that would give the body its own scrollbar,
            // running down the right edge of the dialog and across the dark
            // hero. Instead the whole dialog scrolls inside the overlay, so the
            // scrollbar sits outside it, over the backdrop.
            //
            // Below md the dialog takes the whole screen: on a phone a floating
            // card with this much content wastes the little room there is.
            fullscreen='md-down'
            className='projectModal'
            // On close the focus goes back to whatever held it before the
            // dialog opened — and a plain focus() scrolls that element into
            // view. The project cards are non-focusable <div>s (and a fist
            // click is a synthetic MouseEvent, which moves no focus at all), so
            // that element is usually the hand-nav button up in the hero: the
            // page would jump back to the top on every close.
            restoreFocusOptions={{ preventScroll: true }}
            // The overlay only lands in the DOM once the open transition runs,
            // which can be after the effect above has already looked for it.
            onEntered={(node: HTMLElement) => setScrollTarget(node)}
            dialogClassName='projectDialog'
            contentClassName='projectDialogContent'
            aria-labelledby='projectDialogTitle'
        >
            <button type='button' className='projectClose' onClick={onHide} aria-label='Close project'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
                    <path d='M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708' />
                </svg>
            </button>

            {/* The hero lives inside the scrollable body on purpose: it is the
                opening of the story, not a toolbar, so it scrolls away with it
                and leaves the whole dialog to the content. */}
            <Modal.Body className='projectBody'>
                <header className='projectHero'>
                    <img className='projectHeroImage' src={projectData.image[0]} alt='' aria-hidden='true' />
                    <div className='projectHeroInner'>
                        <span className='projectHeroEyebrow'>Case study</span>
                        <h2 className='projectHeroTitle' id='projectDialogTitle'>{projectData.title}</h2>
                        <p className='projectHeroMeta'>
                            {meta.map((item, index) => (
                                <span className='metaItem' key={item.key}>
                                    {index > 0 && <span className='metaDot' aria-hidden='true'>·</span>}
                                    {item.node}
                                </span>
                            ))}
                        </p>
                    </div>
                </header>

                <div className='projectContent'>
                    {chapters.map((chapter, index) => (
                        <Chapter
                            key={chapter.key}
                            index={index}
                            label={chapter.label}
                            hint={chapter.hint}
                            chapter={projectData[chapter.key]}
                        />
                    ))}

                    {projectData.acquired_skills && projectData.acquired_skills.length > 0 && (
                        <section className='projectSkills'>
                            <h4 className='projectSkillsTitle'>Acquired skills</h4>
                            <ul className='projectSkillsList'>
                                {projectData.acquired_skills.map((skill) => (
                                    <li key={skill} className='skill'>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className='projectFooter'>
                {projectData.link && (
                    <a
                        className='projectVisit'
                        href={projectData.link}
                        target='_blank'
                        rel='noreferrer'
                    >
                        Visit the project
                    </a>
                )}
                <button type='button' className='projectCloseText' onClick={onHide}>Close</button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProjectDialog;
