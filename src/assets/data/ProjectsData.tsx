// The cover is an SVG: the app's own background with the tracked-hand skeleton
// drawn over it, in Tune Crafter's own colours. tunecrafterheader.jpg next to
// it is the untouched original it is generated from.
import tuneCrafterHeader from '../images/tunecrafterheader.svg';
import tuneCrafterLogo from '../images/tunecrafterlogo.png';
import tuneCrafterHUD from '../images/tunecrafterHUD.png';
import naviaHeader from '../images/naviaheader.jpg';
import naviaPilot from '../images/naviapilot.jpg';
import naviaOffsite from '../images/naviaoffsite.jpg';
import snacmanHeader from '../images/snacmanheader.png';
import snacman2 from '../images/snacman2.png';
import snacman3 from '../images/snacman3.png';
import type { CountryCode } from '../../components/Flag';
import ecolensHeader from '../images/ecolensheader.jpg';
import ecolensCleanup from '../images/ecolenscleanup.jpg';
import ecolensSea from '../images/ecolenssea.jpg';
// The three covers are composed from the Figma screens of the prototype, laid
// out on the same dark ground and warm glow the case-study hero uses.
import hostownHeader from '../images/hostownheader.jpg';
import hostownMap from '../images/hostownmap.jpg';
import hostownTrust from '../images/hostowntrust.jpg';

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
    /** Where the work happened, ISO 3166-1 alpha-2. Drawn as a flag on the card and in the case study. */
    country: CountryCode;
    /**
     * When the project was made, ISO-style: "2024", "2024-03" or "2024-03-18".
     * It is the single source of truth for anything date-related, it orders the
     * grid (newest first) and is printed on the card and in the case-study
     * header, so the precision is up to you: a bare year renders as "2024", a
     * month as "Mar 2024". Within the same year, a bare year counts as the
     * earliest entry.
     */
    date: string;
    /** One-liner used on the card in the projects grid. */
    description: string;
    /** [0] is the cover, used both on the card and as the case-study hero. */
    image: string[];
    /** Omitted when there is nothing public to link to: the card drops the button. */
    link?: string;
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
        title: "Navia",
        location: "Master Thesis at Hydromea - Lausanne, Switzerland",
        country: "CH",
        date: "2025",
        role: "UI Design & Development",
        description: "The interface used to control an underwater inspection drone",
        image: [naviaHeader, naviaPilot, naviaOffsite],
        link: "",
        concept: {
            text: "Navia is the software that drives EXRAY, Hydromea's wireless underwater inspection ROV. My thesis covered its two operating screens, the Pilot Page, redesigned and rebuilt, and the Inspector Page, designed from scratch for the person who documents the dive while the pilot flies.",
            points: [
                "Operators found the existing interface unreliable, inconsistent and hard to read mid-dive",
                "Client policy blocked any direct contact with the real operators for the whole internship",
                "Everything had to stay usable on a touchscreen, in the field, alongside a physical remote"
            ],
            image: naviaHeader
        },
        how: {
            text: "The whole system is Python with PyQt, laid out in Qt Designer and structured as MVC. Telemetry reaches the station as MAVLink messages over UDP, gets filtered and dispatched, then feeds the widgets in real time through Qt signals and slots.",
            points: [
                "Built the Pilot Page widgets, notification centre, camera settings, dive checklist, HUD menu and mission panels",
                "Merged the two drone panels into one, so the Mothership and the Flyout stop fighting for space",
                "Rewired the Data Page feedback around the backend worker threads, so downloads and post-processing report real progress",
                "Added a theme system that injects light or dark colour values into the stylesheets at startup"
            ],
            image: naviaPilot
        },
        learnings: {
            text: "With the real operators out of reach, I built my own users. A heuristic evaluation with the software team surfaced the first round of problems, then an offsite day at the lake put around thirty colleagues on the controls, each one piloting for five minutes before passing on.",
            points: [
                "A persona and a timed challenge got colleagues thinking like inspectors, not like engineers",
                "A guided think aloud works better than the textbook version when the hands are busy flying",
                "The sonar map, the 4-clicks measurement and the annotated gallery all came out of a brainstorming poster"
            ],
            image: naviaOffsite
        },
        acquired_skills: ["Python", "PyQt", "Qt Designer", "QSS", "MVC", "MAVLink", "Figma", "Heuristic evaluation", "Think aloud", "Personas", "User research", "UI design"]
    },
    {
        title: "Tune Crafter",
        location: "Universite Paris-Saclay (UPS) - Paris, France",
        country: "FR",
        date: "2024",
        role: "Design & Development",
        description: "A music station played with hands, voice and heartbeat, never with a mouse",
        image: [tuneCrafterHeader, tuneCrafterHUD, tuneCrafterLogo],
        link: "https://allescava.github.io/Tune-Crafter/",
        concept: {
            text: "A laptop turned into an instrument nobody touches. The hands shape the sound, the voice runs the transport, a smartwatch feeds in the heartbeat of whoever is playing. Built with Alessandro Cavallotti and Shubhankar for HCI909, Advanced Programming of Interactive Systems.",
            image: tuneCrafterHUD
        },
        how: {
            text: "React reads three live signals at once, hand landmarks from the webcam, words from the microphone and heart rate from a Wear OS watch, and turns them into calls on a Web Audio engine drawn as a waveform.",
            points: [
                "MediaPipe reads the pose, a state machine per control decides when it counts as a command",
                "Pinch a finger and its drum pad fires, scissor gestures cut loop regions out of the track",
                "A Python Socket.IO server bridges the browser and the watch"
            ]
        },
        learnings: {
            text: "Gesture recognition gives you probabilities, not intentions. The work lived in that gap: deciding when a pose becomes a command, and telling the user what the machine believes it sees. A pose in two steps, open palm then fist, is what separates a deliberate command from an accident. The hand navigation of this portfolio grew out of that layer.",
            image: tuneCrafterLogo
        },
        acquired_skills: ["React", "TypeScript", "MediaPipe", "Web Audio API", "Web Speech API", "Socket.IO", "Python", "Wear OS", "wavesurfer.js", "Finite state machines", "Interaction design", "Vite"]
    },
    {
        title: "SnacMan",
        location: "Personal Project - Milan, Italy",
        country: "IT",
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
            text: "The game loop runs on a canvas driven by requestAnimationFrame, while React handles everything around it, score, state and the screens between runs.",
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
        title: "EcoLens",
        location: "University Project - Paris, France",
        country: "FR",
        date: "2024",
        role: "Design & Development",
        description: "A VR world you clean by hand, then watch age",
        image: [ecolensHeader, ecolensCleanup, ecolensSea],
        link: "https://youtu.be/D6IYETO00yg",
        concept: {
            text: "A headset piece about pollution that argues instead of lecturing. Three littered landscapes, a forest, a mountain and a seabed, and a switch strapped to your hand that shows the same place in the past, the present and the future. Built with Doaa Hussien and Abel Henry-Lapassat for Advanced Immersive Interaction.",
            points: [
                "The argument had to come from the world itself, not from a panel of statistics",
                "Playable by someone putting on a headset for the first time",
                "Three environments sharing one set of rules, so nothing is relearned at the door"
            ],
            image: ecolensHeader
        },
        how: {
            text: "Unity with the XR Interaction Toolkit. A hub room holds the tutorial and one door per environment, and the interface rides on the controllers instead of floating in front of the eyes.",
            points: [
                "Two ways to move, a teleport arc for distance and continuous locomotion for the last few steps",
                "Grab, carry and drop litter into the bin, with a counter in world space tracking what is left",
                "The right panel switches between past, present and future, rebuilding the environment in that state",
                "The left panel reads what is in your hand and answers with how long it takes to decompose"
            ],
            image: ecolensCleanup
        },
        learnings: {
            text: "In VR the interface competes with the world for attention, and the world wins. Moving both panels onto the controllers is what got them read, because a hand is somewhere you are already looking.",
            points: [
                "One tutorial room costs a scene and saves every explanation that would follow",
                "Offering teleport and free movement together, rather than picking one, keeps both the queasy and the impatient",
                "Consequence beats instruction: the same forest in three states says more than any text in it"
            ],
            image: ecolensSea
        },
        acquired_skills: ["Unity", "C#", "XR Interaction Toolkit", "VR", "Diegetic UI", "Locomotion design", "Spatial interaction", "Level design", "Interaction design"]
    },
    {
        title: "HosTown",
        location: "EIT Digital Summer School - Helsinki, Finland",
        country: "FI",
        date: "2024",
        role: "UX Design, team of 7",
        description: "The app that came out of proving the brief wrong",
        image: [hostownHeader, hostownMap, hostownTrust],
        concept: {
            text: "The City of Espoo asked for a VR tour of the Aalto campus, to attract international talent to Finland. The research said Finland has no trouble attracting talent, it has trouble keeping it: people arrive, find nothing to do after six in the evening, and leave. HosTown answers that instead, an app for hosting and joining small local events.",
            points: [
                "The brief handed to us was a solution, and the problem underneath it was never stated",
                "Aalto is already a quarter international, so attraction was not the bottleneck",
                "Meeting in person was the whole point, so the app had to get out of the way"
            ],
            image: hostownHeader
        },
        how: {
            text: "Two weeks, seven people, from a first survey to a clickable Figma prototype. The team split between research and finance, and I took the product design with Emanuele.",
            points: [
                "Surveys and interviews with international students, then 5 Whys to get under the answers",
                "Two personas, the host and the joiner, drawn from what came back",
                "A map as the entry point, so events are found by where you already are",
                "Reliability, rating and credits as one system, earned through challenges, so strangers can meet safely"
            ],
            image: hostownMap
        },
        learnings: {
            text: "The hard part was throwing away a brief a city had already committed to, and having enough evidence to make that defensible rather than an opinion. Talking to researchers, to the student union and to the founder of a competing app is what bought us the right to say no.",
            points: [
                "A client asking for a solution is still describing a problem, only badly",
                "Safety between strangers is an interface problem before it is a policy one",
                "Research you cannot show is research you cannot defend"
            ],
            image: hostownTrust
        },
        acquired_skills: ["Figma", "User research", "Interviews", "Surveys", "Personas", "5 Whys", "Prototyping", "UI design", "Competitor analysis", "Business modelling", "Pitching"]
    }
]

export default projectData;
