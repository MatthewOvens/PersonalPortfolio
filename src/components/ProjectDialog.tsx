import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ProjectData } from '../assets/data/ProjectsData';
import './ProjectDialog.css';

interface ProjectDialogProps {
    show: boolean;
    onHide: any;
    projectData: ProjectData | null;
}

const ProjectDialog = (props : ProjectDialogProps) => {

    console.log("ProjectDialog.tsx")
    console.log(props.projectData)
    console.log(props.show)
    console.log(props.onHide)

/*     const [isOpen, setIsOpen] = useState(false);
 */    
    /* 
    const openDialog = () => {
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    }; */

    return (
        <>
            <Modal
                {...props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{fontSize: "50px"}}>
                    {props.projectData?.title}
                    <div className='location'>
                        {props.projectData?.location}
                    </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='content'>
                    <div className='content1'>
                        <div className='image1Container'>
                            <img src={props.projectData?.image[0]} className='image1'/>
                        </div>
                        <h3>{props.projectData?.description}</h3>
                    </div>
                    <div className='content2'>
                        <h3>{props.projectData?.description}</h3>
                        <div className='image1Container'>
                            <img src={props.projectData?.image[0]} className='image1'/>
                        </div>
                    </div>
                    <div className='content3'>
                        <h3 className='skillstitle'>Acquired Skills</h3>
                        <div className='takeaways'>
                            {props.projectData?.acquired_skills?.map(skill => (
                                <div className='skill first-color second-color-background'>{skill}</div>
                            ))}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button-secondary' onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProjectDialog;
