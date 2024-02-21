import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import studentData from './studentData.json';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

function UploadResume() {
    const { uid } = useParams();
    const [resume, setResume] = useState(null);
    const [showResume, setShowResume] = useState(false);
    const student = studentData.find(student => student.uid === uid);

    useEffect(() => {
        // Fetch the resume on initial render
        fetch(`/UploadResume/get-resume/${uid}`)
            .then(response => response.blob())
            .then(blob => {
                if (blob.size > 0) {
                    setResume(URL.createObjectURL(blob));
                }
            });
    }, [uid]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('resume', file);

        fetch(`/UploadResume/upload/${uid}`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.blob())
            .then(blob => {
                if (blob.size > 0) {
                    setResume(URL.createObjectURL(blob));
                }
            });
    };

    return (
        <div>
            <Header uid={uid} />
            <h1 style={{marginTop : "10px"}}>Upload Your Resume</h1>
            <Container className='resume-container' style={{marginTop: "-100px"}}>
                <Row className="justify-content-md-center" md={2}>
                    <Col className='auto'>
                        <Card className="card" style={{marginTop: "100px"}}>
                            <Card.Header className='card-header'>{student.name}'s Resume</Card.Header>
                            <Card.Body>
                                <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                                    {resume ? (
                                        <div>
                                            <Button className="btn btn-primary" onClick={() => setShowResume(!showResume)}>
                                                {showResume ? 'Hide Resume' : 'Show Resume'}
                                            </Button>
                                            {showResume && <iframe title="Resume" src={resume} width="100%" height="600px"></iframe>}
                                        </div>
                                    ) : (
                                        <p>You have not uploaded a resume.</p>
                                    )}
                                </div>
                                <br/><br/>
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control 
                                            type="file"
                                            accept='.pdf' 
                                            onChange={handleFileChange} 
                                            required
                                        />
                                    </Form.Group>
                                    <br/>
                                    <Button className='add-btn' type="submit">
                                        Upload Resume
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default UploadResume;
