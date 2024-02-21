import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal, Dropdown } from 'react-bootstrap';
import Header from './Header';
import { useParams } from 'react-router-dom';
import '../CSS/AddCertifications.css';

const AddCertifications = () => {
  const {uid} = useParams();
  const [certificationName, setCertificationName] = useState('');
  const [certificationFile, setCertificationFile] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificationToDelete, setCertificationToDelete] = useState('');

  useEffect(() => {
    const fetchCertifications = async () => {
      const response = await fetch(`/AddCertifications/get-certifications/${uid}`);
      const data = await response.json();
      if (data) {
        setCertifications(data);
      } else {
        setCertifications([]);
      }
    };
  
    fetchCertifications();
  }, [uid]);

  const addCertification = async () => {
    if (!certifications.map(certification => certification.name).includes(certificationName)) {
      const formData = new FormData();
      formData.append("name", certificationName);
      formData.append("certificationFile", certificationFile);

      await fetch(`/AddCertifications/add-certification/${uid}`, {
        method: 'POST',
        body: formData
      });

      setCertifications([{ name: certificationName, certificationFile }, ...certifications]);
      setCertificationName('');
      setCertificationFile(null);
      setShowUploadModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const deleteCertification = async (certificationToDelete) => {
    await fetch(`/AddCertifications/delete-certification/${uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uid : uid, certification: certificationToDelete }),
    });
  
    setCertifications(certifications.filter(certification => certification.name !== certificationToDelete));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page refresh
    if (certificationName.trim() !== '' && certificationFile) { // Checks if fields are not empty
      addCertification();
    }
  };

  const handleCertificationClick = (certificationName) => {
    setCertificationToDelete(certificationName);
    setShowDeleteModal(true);
  };

  const handleViewClick = (bufferData) => {
    const arrayBuffer = new Uint8Array(bufferData);
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div>
      <Header uid={uid} />
      <Container className='container'>
        <Row className="justify-content-md-center" md = {2}>
          <Col className='auto'>
            <Card className="card" style={{marginTop : "50px"}}>
              <Card.Header className='card-header'>Add a Certification</Card.Header>
              <Card.Body>
                <ol className="certificate-name">
                  {certifications.length > 0 ? (
                      certifications.map((certification, index) => (
                          <li className='certificate' key={index} onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(`dropdown-${index}`).click();
                          }}>
                              <Dropdown>
                                  <Dropdown.Toggle as="div" id={`dropdown-${index}`}>
                                      {certification.name}
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                      <Dropdown.Item onClick={() => handleViewClick(certification.certificationFile.data)} style={{color: "green"}}>View</Dropdown.Item>
                                      <Dropdown.Item onClick={() => handleCertificationClick(certification.name)} style={{color: "red"}}>Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                              </Dropdown>
                          </li>
                      ))
                  ) : (
                      <div>
                          <p><strong style={{color:"red"}}>No Certifications To Show!!</strong></p>
                      </div>
                  )}
                </ol>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control 
                        type="text" 
                        value={certificationName}
                        onChange={(e) => setCertificationName(e.target.value)}
                        placeholder="Enter Certification Name" 
                        required
                        />
                        <br/>
                        <Form.Control 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setCertificationFile(e.target.files[0])}
                        required
                        />
                    </Form.Group>
                    <br/><br/>
                    <Button className='add-btn' type="submit">
                        Add Certification
                    </Button>
                </Form>
              </Card.Body>
            </Card>
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>Upload successful</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>The certification already exists!</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>Confirm to delete {certificationToDelete}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => { deleteCertification(certificationToDelete); setShowDeleteModal(false); }}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
 );
};

export default AddCertifications;
