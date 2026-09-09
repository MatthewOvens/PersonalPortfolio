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
            text: "Navia is the software that drives **EXRAY**, Hydromea's wireless underwater inspection ROV. My thesis covered its two operating screens, the **Pilot Page**, redesigned and rebuilt, and the **Inspector Page**, designed from scratch for the person who documents the dive while the pilot flies.",
            points: [
                "Pilots read the screen **mid dive**, so anything unclear costs time the drone is spending underwater",
                "The interface had grown **inconsistent** enough that controls had to be hunted for rather than remembered",
                "Everything had to stay usable on a **touchscreen**, in the field, next to a physical remote"
            ],
            image: naviaHeader
        },
        how: {
            text: "Research first, then a rebuild. A **heuristic evaluation** surfaced the first problems, then an **offsite test day** with a challenge to perform with the drones and the **think aloud** method to retrieve data out of it. What came back set the priorities for the rest of the project.",
            points: [
                "**User reseach** with the actual Pilots and with the team",
                "**Redesigned the Pilot Page** so elements stop fighting for space, then rebuilt its widgets, checklist, HUD menu and mission panels",
                "**Python and PyQt** in an MVC structure, **MAVLink** telemetry over UDP reaching the widgets through Qt signals",
                "A **theme system** injecting light or dark values into the stylesheets at startup"
            ],
            image: naviaPilot
        },
        learnings: {
            text: "Underwater the pilot has **no view except the one the software gives them**, so every widget competes for the attention the drone needs. Most of the redesign was deciding what earns a permanent place on screen and what should only appear when it matters.",
            points: [
                "**Consistency is a memory feature**, once the same control looked the same everywhere people stopped searching for it",
                "A guided think aloud works better than the textbook version when the **hands are busy flying**, and a persona is what gets an engineer to behave like an inspector",
                "**Brainstorming with a multidisciplinary team** beats solving alone, engineers, designers, stakeholders read the same problem differently, and the solution that survives all three is usually the right one"
            ],
            image: naviaOffsite
        },
        acquired_skills: ["Python", "PyQt", "Qt Designer", "MVC", "MAVLink", "Figma", "Heuristic evaluation", "Think aloud testing", "Personas", "User research", "UI design"]
    },
    {
        title: "Tune Crafter",
        location: "Universite Paris-Saclay (UPS) - Paris, France",
        country: "FR",
        date: "2024",
        role: "Design & Development",
        description: "A music station played with hands and voice",
        image: [tuneCrafterHeader, tuneCrafterHUD, tuneCrafterLogo],
        link: "https://allescava.github.io/Tune-Crafter/",
        concept: {
            text: "A university project for the course Advanced Programming of Interactive Systems. Tune Crafter is a **loop station** that runs in the browser and is **played in the air** in front of the laptop: the webcam watches the hands, the microphone takes the commands, and a track is built up live out of pads, loops and cuts **without the machine ever being touched**.",
            points: [
                "A **drum pad** sits on each fingertip, pinched against the thumb to fire it",
                "Loops are **recorded, layered and cut while they run**, the waveform on screen is the track as it stands",
                "**The interface is the hand itself**, so the screen can stay on the music rather than on controls"
            ],
            image: tuneCrafterHUD
        },
        how: {
            text: "React reads **two live signals at once**, hand landmarks from the webcam and words from the microphone, and turns them into calls on a **Web Audio** engine drawn as a waveform.",
            points: [
                "**MediaPipe** reads the pose, a **state machine** per control decides when it counts as a command",
                "**Pinch** a finger and its drum pad fires, **scissor gestures** cut loop regions out of the track",
                "The **voice** handles what hands are bad at, play, record and loop, so nothing has to be mimed"
            ]
        },
        learnings: {
            text: "The hard part was never the recognition, it was **synchronising** it. MediaPipe fires landmarks on every frame, React wants discrete actions, and wiring one straight into the other gave scattered conditions and sounds firing twice.",
            points: [
                "A **state machine** per control turned that into one clear question per frame, and the code went from tangled conditions to named states and transitions",
                "**Live feedback** counts as much as accuracy, the HUD draws the tracked hand and the state of every control, so the user sees what the system believes and can correct it",
                "An interface running on **guesses** has to admit it, silence is what makes a misread feel like a bug"
            ],
            image: tuneCrafterLogo
        },
        acquired_skills: ["React", "TypeScript", "MediaPipe", "Web Audio API", "Web Speech API", "wavesurfer.js", "Finite state machines", "Interaction design", "Vite"]
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
            text: "An arcade classic rebuilt for the browser, with the goal of making the whole game playable in a **single tab**, with **no install and no account**.",
            points: [
                "Playable on **desktop and mobile** with the same code base",
                "**Readable at a glance**: one screen, no menus to learn",
                "Fast to pick up, hard to put down"
            ],
            image: snacmanHeader
        },
        how: {
            text: "The **game loop** runs on a canvas driven by **requestAnimationFrame**, while React handles everything around it, score, state and the screens between runs.",
            points: [
                "**Grid-based movement** with collision checks on every tick",
                "One **input layer** mapping both keyboard and swipe gestures",
                "Score and progression persisted locally between sessions"
            ],
            image: snacman2
        },
        learnings: {
            text: "Building the loop by hand made **the cost of every frame** visible, and pushed most of the work **out of React** and into plain state the renderer could read.",
            points: [
                "Separating **game state from UI state** keeps re-renders cheap",
                "**Touch input needs its own timing model**, not a mouse fallback",
                "**Playtesting early** beats tuning numbers in isolation"
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
            text: "A headset piece about pollution that **argues instead of lecturing**. Three littered landscapes, a forest, a mountain and a seabed, and a switch strapped to your hand that shows the same place in the **past, the present and the future**. Built with Doaa Hussien and Abel Henry-Lapassat for Advanced Immersive Interaction.",
            points: [
                "The argument had to come **from the world itself**, not from a panel of statistics",
                "Playable by someone putting on a headset **for the first time**",
                "Three environments sharing one set of rules, so nothing is relearned at the door"
            ],
            image: ecolensHeader
        },
        how: {
            text: "**Unity** with the XR Interaction Toolkit. A **hub room** holds the tutorial and one door per environment, and the interface **rides on the controllers** instead of floating in front of the eyes.",
            points: [
                "**Two ways to move**, a teleport arc for distance and continuous locomotion for the last few steps",
                "Grab, carry and drop litter into the bin, with a counter in world space tracking what is left",
                "The **right panel** switches between past, present and future, rebuilding the environment in that state",
                "The **left panel** reads what is in your hand and answers with how long it takes to decompose"
            ],
            image: ecolensCleanup
        },
        learnings: {
            text: "In VR the interface **competes with the world for attention, and the world wins**. Moving both panels onto the controllers is what got them read, because a **hand is somewhere you are already looking**.",
            points: [
                "**One tutorial room** costs a scene and saves every explanation that would follow",
                "Offering teleport and free movement together, rather than picking one, keeps both the queasy and the impatient",
                "**Consequence beats instruction**: the same forest in three states says more than any text in it"
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
            text: "The City of Espoo asked for a VR tour of the Aalto campus, to **attract** international talent to Finland. The research said Finland has no trouble attracting talent, it has trouble **keeping** it: people arrive, find nothing to do after six in the evening, and leave. HosTown answers that instead, an app for **hosting and joining small local events**.",
            points: [
                "The brief handed to us was **a solution**, and the problem underneath it was never stated",
                "Aalto is already a quarter international, so attraction was not the bottleneck",
                "Meeting in person was the whole point, so the app had to **get out of the way**"
            ],
            image: hostownHeader
        },
        how: {
            text: "**Two weeks, seven people**, from a first survey to a clickable **Figma prototype**. The team split between research and finance, and I took the product design with Emanuele.",
            points: [
                "**Surveys and interviews** with international students, then **5 Whys** to get under the answers",
                "**Two personas**, the host and the joiner, drawn from what came back",
                "**A map as the entry point**, so events are found by where you already are",
                "**Reliability, rating and credits as one system**, earned through challenges, so strangers can meet safely"
            ],
            image: hostownMap
        },
        learnings: {
            text: "The hard part was **throwing away a brief a city had already committed to**, and having enough evidence to make that defensible rather than an opinion. Talking to researchers, to the student union and to the founder of a competing app is what bought us **the right to say no**.",
            points: [
                "A client asking for a solution is **still describing a problem, only badly**",
                "Safety between strangers is an **interface problem before it is a policy one**",
                "**Research you cannot show is research you cannot defend**"
            ],
            image: hostownTrust
        },
        acquired_skills: ["Figma", "User research", "Interviews", "Surveys", "Personas", "5 Whys", "Prototyping", "UI design", "Competitor analysis", "Business modelling", "Pitching"]
    }
]

export default projectData;
