import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { Container, Row, Col, Form, Button, Card, Modal, Alert, Dropdown } from 'react-bootstrap';
import '../CSS/ViewCompanies.css'
import AdminHeader from './AdminHeader';

const ViewCompanies = () => {

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // New state variable
  const [message, setMessage] = useState(null);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch('ViewCompanies/get-companies');
      const data = await response.json();
      if (data) {
        setCompanies(data);
      } else {
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  const deleteCompany = async (companyToDelete) => {
    const response = await fetch(`ViewCompanies/delete-company/${companyToDelete}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const { message } = await response.json();
      console.error('Failed to delete company:', message);
      return;
    }

    setCompanies(companies.filter(company => company.companyName !== companyToDelete));
    setMessage({ text: 'Deletion successful', variant: 'success' });
  };


  const handleCompanyClick = (company, type) => {
    console.log('Company clicked:', company);
    setSelectedCompany(company);
    setShowModal(true);
    setModalType(type);
  };

  const filteredCompanies = companies.filter(company => company.companyName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <AdminHeader />
      <Container className='container'>
        <Row className="justify-content-md-center" md={2}>
          <Col className='auto'>
            <Card className="card">
              <Card.Header className='card-header'>View Companies</Card.Header>
              <Card.Body>
                <Form.Control
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for a company"
                />
                {message && <Alert variant={message.variant}>{message.text}</Alert>}
                <br />
                <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
                  {filteredCompanies.map((company, index) => (
                    <div key={index} className="company-item">
                      <Dropdown drop='top'>
                        <Dropdown.Toggle as="div" id={`dropdown-${index}`} variant="success">
                          <p className="company-name" onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`dropdown-${index}`).click();
                          }}>
                            {company.companyName}
                          </p>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className='custom-dropdown-menu'>
                          <Dropdown.Item onClick={() => { setSelectedCompany(company); setShowDetailsModal(true); }} style={{ color: "green" }}>View</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleCompanyClick(company, 'delete')} style={{ color: "red" }}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  ))}

                </div>
              </Card.Body>
            </Card>
            <Modal show={showModal && modalType === 'delete'} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Company</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete the company "{selectedCompany && selectedCompany.companyName}"?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => { deleteCompany(selectedCompany.companyName); setShowModal(false); }}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal className="custom-modal" show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "Highlight", fontWeight: "bold" }}><strong>Company Details</strong></Modal.Title>
              </Modal.Header>
              <Modal.Body className='company-modal'>
                <p className='cn-dis'><strong>Company Name:</strong> {selectedCompany && selectedCompany.companyName}</p>
                <p className='cn-dis'><strong>Job Title:</strong> {selectedCompany && selectedCompany.jobTitle}</p>
                <p className='cn-dis'><strong>Required Skills:</strong> {selectedCompany && selectedCompany.reqSkills}</p>
                <p className='cn-dis'><strong>Criteria:</strong> {selectedCompany && selectedCompany.jobCriteria}</p>
                <p className='cn-dis'><strong>Package:</strong> {selectedCompany && selectedCompany.cmpPackage}</p>
                {selectedCompany && selectedCompany.jobDescriptionFile && (

                  <div className="button-group">
                    <h5><strong>Job Description File:</strong></h5>
                    <Button
                      variant="primary"
                      className="down-btn"
                      href={`data:${selectedCompany.jobDescriptionFile.contentType};base64,${Buffer.from(selectedCompany.jobDescriptionFile.data).toString('base64')}`}
                      download="Job Description"
                    >
                      Download JD
                    </Button>
                  </div>

                )}
              </Modal.Body>
              <Modal.Footer>
                <Button className='close-btn' onClick={() => setShowDetailsModal(false)}>
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

export default ViewCompanies;
