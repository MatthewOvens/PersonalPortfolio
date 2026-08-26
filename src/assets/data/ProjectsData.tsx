// The cover is an SVG: the app's own background with the tracked-hand skeleton
// drawn over it, in Tune Crafter's own colours. tunecrafterheader.jpg next to
// it is the untouched original it is generated from.
import tuneCrafterHeader from '../images/tunecrafterheader.svg';
import tuneCrafterLogo from '../images/tunecrafterlogo.png';
import snacmanHeader from '../images/snacmanheader.png';
import snacman2 from '../images/snacman2.png';
import snacman3 from '../images/snacman3.png';

/** One of the three chapters every case study is told through. */
export interface ProjectChapter {
    /** Lead paragraph of the chapter. */
    text: string;
    /** Optional bullets: constraints for Concept, steps for How, takeaways for Learnings. */
    points?: string[];
    /** Optional supporting screenshot, shown beside the text on desktop. */
    image?: string;
}

export interface ProjectData {
    title: string;
    location: string;
    /**
     * When the project was made, ISO-style: "2024", "2024-03" or "2024-03-18".
     * It is the single source of truth for anything date-related — it orders
     * the grid (newest first) and is printed on the card and in the case-study
     * header — so the precision is up to you: a bare year renders as "2024", a
     * month as "Mar 2024". Within the same year, a bare year counts as the
     * earliest entry.
     */
    date: string;
    /** One-liner used on the card in the projects grid. */
    description: string;
    /** [0] is the cover, used both on the card and as the case-study hero. */
    image: string[];
    link: string;
    /** Role or short label shown next to the date in the header. */
    role?: string;
    /** The three chapters, identical for every project. */
    concept: ProjectChapter;
    how: ProjectChapter;
    learnings: ProjectChapter;
    /** Tools and methods, shown as tags at the foot of the case study. */
    acquired_skills?: string[];
}

const projectData: ProjectData[] = [{
        title: "Tune Crafter",
        location: "University Project - Paris, France",
        date: "2024",
        role: "Design & Development, team of 3",
        description: "A music station played with hands, voice and heartbeat — never with a mouse",
        image: [tuneCrafterHeader, tuneCrafterLogo],
        link: "https://allescava.github.io/Tune-Crafter/",
        concept: {
            text: "A laptop turned into an instrument nobody touches. Tune Crafter puts a small DJ booth behind the webcam: the hands shape the sound, the voice runs the transport, and a smartwatch feeds the room the heartbeat of whoever is playing. Built with Alessandro Cavallotti and Shubhankar for HCI909 — Advanced Programming of Interactive Systems.",
            points: [
                "Webcam, microphone and smartwatch as the only input devices — no mouse, no keyboard",
                "Each channel doing what it is best at: hands for continuous control, voice for discrete commands",
                "Learnable in one sitting: a legend of the vocabulary on screen, and a live readout of what the machine thinks it just saw"
            ],
            image: tuneCrafterLogo
        },
        how: {
            text: "A React front end reads three live signals at once — hand landmarks from the webcam, words from the microphone, and heart rate pushed in from a Wear OS watch — and turns them into calls on a Web Audio engine drawn as a waveform.",
            points: [
                "MediaPipe Tasks Vision recognises the pose; a state machine per control decides when a pose actually counts as a command",
                "Sound buffers decoded up front, so a pinch of any finger fires its drum pad — kick, snare, hat, clap — with no load delay",
                "wavesurfer.js draws the track and owns the loop regions two-handed scissor gestures cut out of it",
                "Continuous speech recognition for the transport words, plus the switches into the Christmas and piano sound banks",
                "A Python Socket.IO server bridging the browser and the Wear OS app, streaming heart rate into the visuals",
                "An analytics event on every gesture and command, to see which interactions people actually found"
            ]
        },
        learnings: {
            text: "Gesture recognition hands you probabilities, not intentions. Most of the work lived in the distance between the two: deciding when a pose is a command, and saying out loud what the machine currently believes it sees.",
            points: [
                "A two-step pose — open palm, then fist — is what separates a deliberate command from an accidental one",
                "Constant feedback beats raw accuracy: the readout of the recognised gesture is what makes an invisible vocabulary learnable",
                "Splitting the modalities by nature, discrete to the voice and continuous to the hands, removed most of the ambiguity",
                "The hand navigation of this very portfolio grew out of this gesture layer"
            ]
        },
        acquired_skills: ["React", "TypeScript", "MediaPipe", "Web Audio API", "Web Speech API", "Socket.IO", "Python", "Wear OS", "wavesurfer.js", "Finite state machines", "Interaction design", "Vite"]
    },
    {
        title: "SnacMan",
        location: "Personal Project - Milan, Italy",
        date: "2023",
        role: "Design & Development",
        description: "A web-based arcade game built from scratch",
        image: [snacmanHeader, snacman2, snacman3],
        link: "https://matthewovens.github.io/SnakeMan/",
        concept: {
            text: "An arcade classic rebuilt for the browser, with the goal of making the whole game playable in a single tab, with no install and no account.",
            points: [
                "Playable on desktop and mobile with the same code base",
                "Readable at a glance: one screen, no menus to learn",
                "Fast to pick up, hard to put down"
            ],
            image: snacmanHeader
        },
        how: {
            text: "The game loop runs on a canvas driven by requestAnimationFrame, while React handles everything around it — score, state and the screens between runs.",
            points: [
                "Grid-based movement with collision checks on every tick",
                "Input layer that maps both keyboard and swipe gestures",
                "Score and progression persisted locally between sessions"
            ],
            image: snacman2
        },
        learnings: {
            text: "Building the loop by hand made the cost of every frame visible, and pushed most of the work out of React and into plain state the renderer could read.",
            points: [
                "Separating game state from UI state keeps re-renders cheap",
                "Touch input needs its own timing model, not a mouse fallback",
                "Playtesting early beats tuning numbers in isolation"
            ],
            image: snacman3
        },
        acquired_skills: ["React", "TypeScript", "Canvas", "CSS", "Game loop", "Responsive design", "Git"]
    },
    {
        title: "Project 2",
        location: "Personal Project - Milan, Italy",
        date: "2023",
        role: "Design & Development",
        description: "This is a description of project 2",
        image: [snacman2],
        link: "https://www.google.com",
        concept: {
            text: "Describe here the problem the project starts from, who it is for, and what the finished thing is meant to do.",
            points: [
                "The constraint that shaped the idea",
                "The audience it was designed for"
            ]
        },
        how: {
            text: "Describe here how it was built: the stack, the architecture and the decisions worth explaining.",
            points: [
                "The main technical choice and why",
                "The hardest part to get right"
            ]
        },
        learnings: {
            text: "Describe here what changed in the way you work after this project.",
            points: [
                "What you would do the same way again",
                "What you would do differently"
            ]
        },
        acquired_skills: ["React", "TypeScript", "Python", "HTML"]
    },
    {
        title: "Snac-Man",
        location: "Personal Project - Milan, Italy",
        date: "2022",
        role: "Design & Development",
        description: "A web-based snake game",
        image: [snacmanHeader],
        link: "https://www.google.com",
        concept: {
            text: "Describe here the problem the project starts from, who it is for, and what the finished thing is meant to do."
        },
        how: {
            text: "Describe here how it was built: the stack, the architecture and the decisions worth explaining."
        },
        learnings: {
            text: "Describe here what changed in the way you work after this project."
        }
    },
    {
        title: "Snac-Man",
        location: "Personal Project - Milan, Italy",
        date: "2022",
        role: "Design & Development",
        description: "A web-based snake game",
        image: [snacmanHeader],
        link: "https://www.google.com",
        concept: {
            text: "Describe here the problem the project starts from, who it is for, and what the finished thing is meant to do."
        },
        how: {
            text: "Describe here how it was built: the stack, the architecture and the decisions worth explaining."
        },
        learnings: {
            text: "Describe here what changed in the way you work after this project."
        }
    }
]

export default projectData;
