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
    /** Human-readable timeframe, shown in the case-study header. */
    period?: string;
    /** One-liner used on the card in the projects grid. */
    description: string;
    /** [0] is the cover, used both on the card and as the case-study hero. */
    image: string[];
    link: string;
    /** Role or short label shown next to the period in the header. */
    role?: string;
    /** The three chapters, identical for every project. */
    concept: ProjectChapter;
    how: ProjectChapter;
    learnings: ProjectChapter;
    /** Tools and methods, shown as tags at the foot of the case study. */
    acquired_skills?: string[];
}

const projectData: ProjectData[] = [{
        title: "SnacMan",
        location: "Personal Project - Milan, Italy",
        period: "2023",
        role: "Design & Development",
        description: "A web-based arcade game built from scratch",
        image: [snacmanHeader, snacman2, snacman3],
        link: "https://www.google.com",
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
        period: "2023",
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
        period: "2022",
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
        period: "2022",
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
