import "./Projects.css";
import projectData, { ProjectData } from "../assets/data/ProjectsData";
import ProjectDialog from "./ProjectDialog";
import { useState } from "react";

const Projects = () => {

  const [modalShow, setModalShow] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData|null>(null);

  function openModal(index: number) {
    setModalShow(true);
    setSelectedProject(projectData[index]);
  }

  return (
    <>
      <div className='description'>
        <span className="section-eyebrow">Portfolio</span>
        <h2 className="section-title">Projects</h2>
        <p className="section-sub">Explore my diverse portfolio showcasing a fusion of technical implementations and creative design ideas</p>
      </div>
      <div className="projectsContainer">
        {projectData.map((val, index) => (
          <div key={index} className="projectBox" onClick={() => openModal(index)}>
            <img src={val.image[0]} className='projectImage' alt={val.title}/>
            <div className='projectTxt'>
              <h3 className='projectTitle'>{val.title}</h3>
              <p className='projectDesc'>{val.description}</p>
            </div>
          </div>
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
