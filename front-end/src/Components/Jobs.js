import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Tab, Tabs, InputGroup, FormControl } from 'react-bootstrap';
import '../CSS/Jobs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faClock, faCheckCircle, faTimesCircle);

function Jobs() {
    const { uid } = useParams();
    const [companies, setCompanies] = useState([]);
    const [appCompanies, setAppCompanies] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [key, setKey] = useState('explore');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/ViewCompanies/get-companies')
            .then(response => response.json())
            .then(data => {
                setCompanies(data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            })
        
        fetch(`/StdInterests/get-stdinterest/${uid}`)
            .then(response => response.json())
            .then(data => {
                setAppCompanies(data);
            })
            .catch(error => {
                console.error('Error in Fetching: ', error);
            })
    }, [uid]);

    const appliedCompanies = appCompanies
    const availableCompanies = companies.filter(company => !appliedCompanies.find(appliedCompany => appliedCompany.companyName === company.companyName));
    const filteredAppliedCompanies = appliedCompanies.filter(company => company.companyName.toLowerCase().includes(search.toLowerCase()));
    const filteredAvailableCompanies = availableCompanies.filter(company => company.companyName.toLowerCase().includes(search.toLowerCase()));
    const handleApply = (companyName) => {
        fetch('/Apply/std', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyName,
                uid
            }),
        })
        .then(response => response.json())
        .then(data => {
            setAppCompanies(prevState => [...prevState, { companyName, students: [uid] }]);
            setShowSuccessModal(true);
        })
        .catch(error => {
            setShowErrorModal(true);
        })
    };

    return (
        <div className="p-3">
            <Header uid={uid} />
            <Container fluid className="py-3 px-lg-5">
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="tab-bar"
                    id="justify-tab-example"
                    justify
                >
                    <Tab className='tab-tile' eventKey="explore" title="Explore Jobs">
                    <br/>
                        <InputGroup className="search-bar">
                            <FormControl
                                placeholder="Search by Company Name"
                                aria-label="Search by Company Name"
                                aria-describedby="basic-addon2"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </InputGroup>
                        <Row md={3} className="g-4">
                            {filteredAvailableCompanies.length > 0 ? (
                                filteredAvailableCompanies.map(company => (
                                    <Col>
                                        <Card className="mb-4">
                                            <Card.Header style={{backgroundColor: '#D7DAF2', color: 'black'}}>{company.companyName}</Card.Header>
                                            <Card.Body className="scrollable-card">
                                                <Card.Text style={{textAlign: "left"}}>
                                                    <strong>Role:</strong> {company.jobTitle}<br/>
                                                    <strong>Required Skills:</strong> {company.reqSkills}<br/>
                                                    <strong>Job Criteria:</strong> {company.jobCriteria}<br/>
                                                    <strong>Package:</strong> {company.cmpPackage}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <div className='card-foot'>
                                                    <Button variant="primary" onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = `data:${company.jobDescriptionFile.contentType};base64,${Buffer.from(company.jobDescriptionFile.data).toString('base64')}`;
                                                            link.download = 'Job Description';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }}>
                                                        Download JD
                                                    </Button>
                                                    <Button className='apply-btn' onClick={() => handleApply(company.companyName)}>Apply</Button>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <div><br/>
                                <p style={{ color: 'red', marginTop: "150px", fontSize: "30px" }}>No Jobs To Show</p></div>
                            )}
                        </Row>
                    </Tab>
                    <Tab eventKey="applied" title="Applied Jobs">
                        <br/>
                        <InputGroup className="search-bar">
                            <FormControl
                                placeholder="Search by Company Name"
                                aria-label="Search by Company Name"
                                aria-describedby="basic-addon2"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </InputGroup>
                        <Row md={3} className="g-4">
                            {filteredAppliedCompanies.length > 0 ? (
                                filteredAppliedCompanies.map(company => (
                                    <Col>
                                        <Card className="mb-4">
                                            <Card.Header style={{backgroundColor: '#D7DAF2', color: 'black'}}>{company.companyName}</Card.Header>
                                            <Card.Body className="scrollable-card">
                                                <Card.Text style={{textAlign: "left"}}>
                                                    <strong>Role:</strong> {company.jobTitle}<br/>
                                                    <strong>Required Skills:</strong> {company.reqSkills}<br/>
                                                    <strong>Job Criteria:</strong> {company.jobCriteria}<br/>
                                                    <strong>Package:</strong> {company.cmpPackage}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <div className='card-foot'>
                                                    <Button variant="primary" onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = `data:${company.jobDescriptionFile.contentType};base64,${Buffer.from(company.jobDescriptionFile.data).toString('base64')}`;
                                                            link.download = 'Job Description';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }}>
                                                        Download JD
                                                    </Button>
                                                    {company.status === 'rejected' ? (
                                                        <p style={{ color: 'red' }}>
                                                            <FontAwesomeIcon icon={['fas', 'times-circle']} /> Rejected
                                                        </p>
                                                        ) : company.status === 'approved' ? (
                                                        <p style={{ color: 'green' }}>
                                                            <FontAwesomeIcon icon={['fas', 'check-circle']} /> Approved
                                                        </p>
                                                        ) : (
                                                        <p style={{ color: 'orange' }}>
                                                            <FontAwesomeIcon icon={['far', 'clock']} /> Pending
                                                        </p>
                                                    )}
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                                 <Modal.Header closeButton>
                                     <Modal.Title>Success</Modal.Title>
                                 </Modal.Header>
                                 <Modal.Body style={{color: "green"}}>Applied Successfully</Modal.Body>
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
                                 <Modal.Body style={{color: "red"}}>Error Occured While Applying!</Modal.Body>
                                 <Modal.Footer>
                                     <Button variant="danger" onClick={() => setShowErrorModal(false)}>
                                     Close
                                     </Button>
                                 </Modal.Footer>
                             </Modal>
         
                                    </Col>
                                ))
                            ) : (
                                <div><br/>
                                <p style={{color: "red"}}>You Have Not Applied To Any Company</p></div>
                            )}
                        </Row>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
}

export default Jobs;