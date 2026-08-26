import "./Projects.css";
import { ProjectData } from "../assets/data/ProjectsData";
import { formatProjectDate, projectsByDate } from "../utils/projectDates";
import ProjectDialog from "./ProjectDialog";
import { useState } from "react";

const CalendarIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h.5A1.5 1.5 0 0 1 15 2.5v11A1.5 1.5 0 0 1 13.5 15h-11A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1H3V.5a.5.5 0 0 1 .5-.5M2 4v9.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V4z" />
  </svg>
);

/**
 * One project in the grid: the cover fills the card, the date and the title sit
 * over it. Deliberately just the essentials — the skills and the full story
 * live inside the case study. All of it is readable at rest: the hand cursor
 * dispatches synthetic clicks and never fires a real :hover, so anything kept
 * behind a hover state would be unreachable by gesture.
 */
const ProjectCard = ({ project, onOpen }: { project: ProjectData; onOpen: () => void }) => (
  <article className="projectBox">
    <img src={project.image[0]} className="projectImage" alt="" aria-hidden="true" loading="lazy" />

    <span className="projectDate">
      <CalendarIcon />
      {formatProjectDate(project.date)}
    </span>

    <div className="projectTxt">
      <h3 className="projectTitle">
        {/* The only interactive element on the card — so it is reachable by
            keyboard — but its ::after stretches over the whole surface, which
            keeps the entire card clickable by mouse and by fist gesture. */}
        <button type="button" className="projectOpen" onClick={onOpen}>
          {project.title}
        </button>
      </h3>

      <p className="projectDesc">{project.description}</p>
    </div>
  </article>
);

const Projects = () => {

  const [modalShow, setModalShow] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData|null>(null);

  function openModal(project: ProjectData) {
    setModalShow(true);
    setSelectedProject(project);
  }

  return (
    <>
      <div className='description'>
        <span className="section-eyebrow">Portfolio</span>
        <h2 className="section-title">Projects</h2>
        <p className="section-sub">Explore my diverse portfolio showcasing a fusion of technical implementations and creative design ideas</p>
      </div>
      {/* Newest first — see projectsByDate. */}
      <div className="projectsContainer">
        {projectsByDate.map((val, index) => (
          <ProjectCard key={`${val.title}-${index}`} project={val} onOpen={() => openModal(val)} />
        ))}
      </div>

      <ProjectDialog
        show={modalShow}
        onHide={() => setModalShow(false)}
        projectData={selectedProject}
      />
    </>
  );
};

export default Projects;
