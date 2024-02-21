import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, Card, Button, Modal, Form, Row, Col, Container } from 'react-bootstrap';

function StudentProjects() {
    const {uid} = useParams();
    const [projects, setProjects] = useState({});
    const [showDelete, setShowDelete] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [deleteProjectIndex, setDeleteProjectIndex] = useState(null);
    const [newProject, setNewProject] = useState({projectTitle: '', projectObj: '', projectURL: ''});

    useEffect(() => {
        fetchProjects();
    }, [uid]);

    const fetchProjects = () => {
        fetch(`/get-projects/${uid}`)
            .then(response => response.json())
            .then(data => {
                setProjects(data);
            })
    }

    const handleCloseDelete = () => setShowDelete(false);
    const handleCloseAdd = () => {
        setShowAdd(false);
        setNewProject({projectTitle: '', projectObj: '', projectURL: ''});
    };

    const handleDelete = (index) => {
        setDeleteProjectIndex(index);
        setShowDelete(true);
    };

    const deleteProject = () => {
        const projectTitle = projects.projectTitle[deleteProjectIndex];
        const projectObj = projects.projectObj[deleteProjectIndex];
        const projectURL = projects.projectURL[deleteProjectIndex];

        fetch(`/delete-project/${uid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectTitle, projectObj, projectURL }),
        })
            .then(() => {
                fetchProjects();
                setShowDelete(false);
            })
            .catch(error => console.error('There was an error!', error));
    };

    const handleInputChange = (event) => {
        setNewProject({...newProject, [event.target.name]: event.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`/add-project/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject),
        })
            .then(response => response.json())
            .then(data => {
                // Optimistically update the state
                setProjects(prevProjects => ({
                    ...prevProjects,
                    projectTitle: [...prevProjects.projectTitle, newProject.projectTitle],
                    projectObj: [...prevProjects.projectObj, newProject.projectObj],
                    projectURL: [...prevProjects.projectURL, newProject.projectURL]
                }));
                setShowAdd(true);
                setNewProject({projectTitle: '', projectObj: '', projectURL: ''});
            })
            .catch(error => console.error('There was an error!', error));
    };

    return (
        <div>
            <Header uid={uid}></Header>
            <Container fluid className="py-3 px-lg-5">
            <Tabs className="tab-bar"
                    id="justify-tab-example"
                    justify
                    defaultActiveKey="view"
            >
                <Tab className='tab-tile' eventKey="view" title="View Projects">
                    {projects.projectTitle && projects.projectTitle.length > 0 ? (
                        <Row style={{marginLeft: "50px"}} xs = {1} md={3} className="g-4">
                            {projects.projectTitle.map((title, index) => (
                                <Col key={index}>
                                    <Card className='mb-4' style={{width: "400px", height: "250px"}}>
                                    <Card.Header style={{backgroundColor: '#D7DAF2', color: 'red', fontSize: "18px", fontWeight: "bold"}}>{title}</Card.Header>
                                        <Card.Body className="scrollable-card" style={{textAlign: "justify"}}>
                                            <Card.Text>
                                                <strong>Project Description: </strong>{projects.projectObj[index]}<br/><br/>
                                                <strong>Project URL: </strong><a style={{textDecoration: "none"}} href={projects.projectURL[index]} target="_blank">Click Here</a><br/>
                                            </Card.Text><br/>
                                            <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p style={{ color: 'red', marginTop: "200px", fontSize: "30px" }}>No Projects To Show!!</p>
                    )}
                </Tab>
                <Tab style={{display: "flex", justifyContent: "center"}} eventKey="add" title="Add Project">
                    <Card className="card" style={{marginTop : "50px"}}>
                        <Card.Header className='card-header'>Add Project</Card.Header>
                        <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="projectTitle">
                                <Form.Label>Project Title</Form.Label>
                                <Form.Control placeholder='Enter Your Project Title' type="text" name="projectTitle" value={newProject.projectTitle} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="projectObj">
                                <Form.Label>Project Description</Form.Label>
                                <Form.Control placeholder='Describe Your Project' as="textarea" name="projectObj" value={newProject.projectObj} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="projectURL">
                                <Form.Label>Project URL</Form.Label>
                                <Form.Control placeholder='Place Project /Github Repository URL' type="text" name="projectURL" value={newProject.projectURL} onChange={handleInputChange} required />
                            </Form.Group><br/><br/>
                            <Button variant="success" type="submit">
                                Add Project
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                </Tab>
            </Tabs>
            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm to Delete Project?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this project?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={deleteProject}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Project Added</Modal.Title>
                </Modal.Header>
                <Modal.Body>The project has been successfully added.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            </Container>
        </div>
    );
}

export default StudentProjects;
