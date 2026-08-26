// Dates of the projects: one place to read them from, one place to order them.
//
// A project's `date` is written ISO-style at whatever precision is actually
// known ("2024", "2024-03", "2024-03-18"), so both reading and sorting have to
// cope with the mixed forms.

import projectData, { ProjectData } from "../assets/data/ProjectsData";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * A `date` rendered for reading: "2024-03" becomes "Mar 2024", a bare "2024"
 * stays "2024". Anything unparseable is printed as written, so a hand-typed
 * value never disappears from the page.
 */
export const formatProjectDate = (date: string): string => {
    const [year, month] = date.split("-");
    const index = Number(month) - 1;
    return MONTHS[index] ? `${MONTHS[index]} ${year}` : date;
};

/**
 * Sortable key for a `date`, padded so a plain string comparison orders the
 * mixed precisions correctly. A bare year becomes "2024-00-00", i.e. it sorts
 * before every dated entry of the same year.
 */
const sortKey = (date: string): string => {
    const [year = "0000", month = "00", day = "00"] = date.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/**
 * The grid reads as a reverse-chronological feed: newest work first. Sorted
 * once, here, so every consumer sees the same order.
 */
export const projectsByDate: ProjectData[] = [...projectData].sort(
    (a, b) => sortKey(b.date).localeCompare(sortKey(a.date))
);
