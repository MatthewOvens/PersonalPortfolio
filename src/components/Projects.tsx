import "./Projects.css";
import projectData from "../assets/data/ProjectsData";

const Projects = () => {

  console.log("projectData");
  console.log(projectData);

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
              <div key={index} className="projectBox">
                <img src={val.image} className='projectImage'/>
                <div className='projectTxt'>
                  <h3 style={{fontWeight:'600', color:'#2a2e36'}}>{val.title}</h3>
                  <span style={{fontSize:'large', color:'#2a2e36'}}>{val.description}</span> 
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