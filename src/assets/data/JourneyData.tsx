export type JourneyTrack = 'study' | 'work';

export interface JourneyEntry {
    /** Which lane the entry sits in: study on the left, work on the right. */
    track: JourneyTrack;
    /** Sort key, YYYY-MM. Only orders the timeline, never rendered. */
    start: string;
    /** Human-readable range, shown on the axis. */
    period: string;
    title: string;
    org: string;
    summary?: string;
    details?: string[];
    /** Tools and methods used, shown as tags at the foot of the card. */
    skills?: string[];
    /** Link to the related case study, once one exists in ProjectsData. */
    link?: { label: string; href: string };
}

const journeyData: JourneyEntry[] = [
    {
        track: "work",
        start: "2025-01",
        period: "Jan 2025 - Jul 2026",
        title: "Co-founder, UI Developer",
        org: "Halfpast - Zurich, Switzerland (remote)",
        summary: "Took a mobile app from concept to beta with a team of three, owning product design end to end: user research, user flows, Figma prototypes and UI components.",
        skills: ["User Research", "Figma", "User-centered design", "GA4", "Premiere", "Adobe Fresco", "Canva"]
    },
    {
        track: "work",
        start: "2024-03",
        period: "Mar 2024 - Feb 2025",
        title: "UI Developer",
        org: "Hydromea - Lausanne, Switzerland",
        summary: "Designed and shipped features for Navia, the control software of an underwater inspection ROV, turning requirements gathered from its operators into interface decisions.",
        skills: ["Python", "PyQt", "Qt Designer", "Figma", "User-centered design", "Adobe Illustrator", "Photoshop", "Agile scrum"]
    },
    {
        track: "study",
        start: "2022-09",
        period: "2022 - 2024",
        title: "MSc in Human Computer Interaction & Design (HCID)",
        org: "EIT Digital Master School",
        details: [
            "Entry year: UPM - Madrid, Spain",
            "Exit year: UPS - Paris, France",
            "Summer school: “Digital Platform for Smart Cities” - Aalto University, Helsinki"
        ]
    },
    {
        track: "work",
        start: "2021-07",
        period: "Jul 2021 - Sep 2022",
        title: "Web Developer",
        org: "Bit srl - Turin, consultant at Healthy Reply, Milan",
        summary: "Full-stack development of the SBBL web application for the Lombardy region, working in an Agile team across the Angular front end and the SpringBoot back end.",
        skills: ["Angular", "TypeScript", "SpringBoot", "Agile scrum"]
    },
    {
        track: "study",
        start: "2020-03",
        period: "Mar 2020 - Jun 2020",
        title: "Postgraduate studies",
        org: "Bit Academy - Turin, Italy"
    },
    {
        track: "study",
        start: "2017-09",
        period: "2017 - 2020",
        title: "Bachelor in Computer Science",
        org: "Università Milano-Bicocca - Milan, Italy",
        details: [
            "Erasmus+ programme: 6 months at Universidad Rovira i Virgili, Tarragona"
        ]
    }
]

// Newest first, so the two tracks interleave on their own rather than by hand.
export default [...journeyData].sort((a, b) => b.start.localeCompare(a.start));
