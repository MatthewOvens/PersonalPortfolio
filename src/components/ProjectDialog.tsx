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

    return (
        <>
            <Modal
                {...props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className='dialogTitle'>
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
                        <p className='dialogText'>{props.projectData?.description}</p>
                    </div>
                    <div className='content2'>
                        <p className='dialogText'>{props.projectData?.description}</p>
                        <div className='image1Container'>
                            <img src={props.projectData?.image[0]} className='image1'/>
                        </div>
                    </div>
                    <div className='content3'>
                        <h4 className='skillstitle'>Acquired Skills</h4>
                        <div className='takeaways'>
                            {props.projectData?.acquired_skills?.map(skill => (
                                <div key={skill} className='skill'>{skill}</div>
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
