import "./Projects.css";
import projectData, { ProjectData } from "../assets/data/ProjectsData";
import { Button } from "react-bootstrap";
import ProjectDialog from "./ProjectDialog";
import { useState } from "react";

const Projects = () => {

  console.log("projectData");
  console.log(projectData);

  const [modalShow, setModalShow] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData|null>(null);

  function openModal(index: number) {
    setModalShow(true);
    setSelectedProject(projectData[index]);
  } 

  return (
    <>
      <div className='description'>
        <h1 className="third-color">Projects</h1>
        <h3 className="third-color">Explore my diverse portfolio showcasing a fusion of technical implementations and creative design ideas</h3>
      </div>
      <div className="projectsContainer">
        {projectData.map((val, index) => {
          return (
            <>
              <div key={index} className="projectBox" onClick={() => openModal(index)}>
                <img src={val.image[0]} className='projectImage'/>
                <div className='projectTxt'>
                  <h3 style={{fontWeight:'600', color:'#2a2e36'}}>{val.title}</h3>
                  <span style={{fontSize:'large', color:'#2a2e36'}}>{val.description}</span> 
                </div>
              </div>
            </>
           );
        })}
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