import "./Projects.css";
import projectData from "../assets/data/ProjectsData";

const Projects = () => {

  console.log("projectData");
  console.log(projectData);

  return (
    <>
      <div className='description'>
        <h1>Projects</h1>
        <h3>Explore my diverse portfolio showcasing a fusion of technical implementations and creative design ideas</h3>
      </div>
      <div className="projectsContainer">
        {projectData.map((val, index) => {
          return (
            <>
              <div key={index} className="projectBox">
                <img src={val.image} className='projectImage'/>
                <div className='projectTxt'>
                  <h3 style={{fontWeight:'600'}}>{val.title}</h3>
                  <span style={{fontSize:'large'}}>{val.description}</span> 
                </div>
              </div>
            </>
           );
        })}
      </div>
    </>
  );
};

export default Projects;