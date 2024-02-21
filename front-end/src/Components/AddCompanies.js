import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import AdminHeader from './AdminHeader';

const AddCompanies = () => {

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setjobTitle] = useState('');
  const [reqSkills, setreqSkills] = useState('');
  const [jobCriteria, setjobCriteria] = useState('');
  const [cmpPackage, setcmpPackage] = useState('');
  const [file, setFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // useEffect(() => {
  //   const fetchCompanies = async () => {
  //     const response = await fetch('AddCompanies/get-companies');
  //     const data = await response.json();
  //     if (data) {
  //       setCompanies(data);
  //     } else {
  //       setCompanies([]);
  //     }
  //   };
  //   fetchCompanies();
  // }, []);

  const addCompany = async () => {
    if (!companies.map(company => company.companyName).includes(companyName)) {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("jobTitle", jobTitle);
      formData.append("reqSkills", reqSkills);
      formData.append("jobCriteria", jobCriteria);
      formData.append("cmpPackage", cmpPackage);
      formData.append("jobDescriptionFile", file);

      await fetch('AddCompanies/add-company', {
        method: 'POST',
        body: formData
      });

      setCompanies([{ companyName, jobTitle, reqSkills, jobCriteria, cmpPackage }, ...companies]);
      setCompanyName('');
      setjobTitle('');
      setreqSkills('');
      setjobCriteria('');
      setcmpPackage('');
      setFile(null);
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page refresh
    if (companyName.trim() !== '' && jobTitle.trim() !== '' && reqSkills.trim() !== '' && jobCriteria.trim() !== '' && cmpPackage.trim() !== '') { // Checks if fields are not empty
      addCompany();
    }
  };

  return (
    <div>
        <AdminHeader/>
      <Container className='container'>
        <Row className="justify-content-md-center" md = {2}>
          <Col className='auto'>
            <Card className="card" style={{marginTop : "50px"}}>
              <Card.Header className='card-header'>Add a Company</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter Company Name" 
                        required
                        />
                        <br/>
                        <Form.Control 
                        type="text" 
                        value={jobTitle}
                        onChange={(e) => setjobTitle(e.target.value)}
                        placeholder="Enter Job Title" 
                        required
                        />
                        <br/>
                        <Form.Control 
                        as="textarea" 
                        value={reqSkills}
                        onChange={(e) => setreqSkills(e.target.value)}
                        placeholder="Enter Required Skills" 
                        required
                        />
                        <br/>
                        <Form.Control 
                        as="textarea" 
                        value={jobCriteria}
                        onChange={(e) => setjobCriteria(e.target.value)}
                        placeholder="Enter Job Criteria" 
                        required
                        />
                        <br/>
                        <Form.Control 
                        type="text" 
                        value={cmpPackage}
                        onChange={(e) => setcmpPackage(e.target.value)}
                        placeholder="Enter Package" 
                        required
                        />
                        <br/>
                        <Form.Control 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        />
                    </Form.Group>
                    <br/><br/>
                    <Button className='add-btn' type="submit">
                        Add Company
                    </Button>
                </Form>
              </Card.Body>
            </Card>
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>Upload successful</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>The company already exists!</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
 );
};

export default AddCompanies;
