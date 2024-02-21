import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Table, Button, Modal, Container, Row, Col, Card } from 'react-bootstrap';
import Header from './Header';
import { useParams, Link } from 'react-router-dom';
import problemSets from './ProblemSet.json';
import { FaCopy } from 'react-icons/fa';
import '../CSS/ProblemSolving.css';

async function fetchSubmissions(uid) {
  const response = await fetch(`/api/submissions?uid=${uid}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const submissions = await response.json();
  return submissions;
}

function ProblemSolving() {
  const { uid } = useParams();
  const [problemSet, setProblemSets] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  let serialNumber = 1;

  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedCode);
      setCopySuccess('Copied!');
    } catch (err) {
      setCopySuccess('Failed to copy text');
    }
  };
  const handleClose = () => {
    setCopySuccess('');
    setShow(false);
  }
  const handleShow = (code) => {
    setSelectedCode(code);
    setShow(true);
  };

  useEffect(() => {
    setProblemSets(Object.keys(problemSets));
    fetchSubmissions(uid)
      .then(submissions => setSubmissions(submissions))
      .catch(error => console.error('Error:', error));
  }, [uid]);


  return (
    <div>
      <Header uid={uid} />
      <Tabs style={{marginTop: "20px", marginLeft: "20px", marginRight: "20px"}} defaultActiveKey="problemSet" id="fill-tab-example"
      className="mb-3"
      fill>
        <Tab eventKey="problemSet" title="Problem Sets">
            <Container>
       <Row xs={1} md={3}>
           {problemSet.map((set, index) => (
            <Col key={index}>
              <Card style={{borderColor: "black", borderWidth: "2px", backgroundColor: "#f8f9fa"}} className='mb-4'>
                <Card.Body>
                  <Link className="link" to={`/${uid}/problems/${set}`}>
                    <Card.Title style={{color: "#1F0954"}}>{set}</Card.Title>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
        </Tab>
        <Tab style={{marginLeft: "50px", marginRight: "50px"}} eventKey="submissions" title="My Submissions">
          <Table responsive>
            <thead className="custom-thead">
              <tr>
                <th>S.No</th>
                <th>Problem Name</th>
                <th>Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                submission.code.map((code, codeIndex) => (
                  <tr key={`${index}-${codeIndex}`}>
                    <td>{serialNumber++}</td>
                    <td>{submission.problemName}</td>
                    <td><Link style={{fontSize: "16px", fontWeight: "lighter", color: "blue"}} className="link" onClick={() => handleShow(submission.code[codeIndex])}>View Code</Link></td>
                    <td style={{ color: submission.status[codeIndex] === 'Accepted' ? 'green' : 'red' }}><strong>{submission.status[codeIndex]}</strong></td>
                  </tr>
                ))
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
      <Modal show={show} onHide={handleClose} style={{width: "600px", marginLeft: "30%"}}>
      <Modal.Header closeButton>
        <Modal.Title>Code</Modal.Title>
        <FaCopy onClick={handleCopy} style={{ cursor: 'pointer', marginLeft: "10px" }} />
        {copySuccess}
      </Modal.Header>
      <Modal.Body style={{ marginLeft: "20px", marginRight:"20px", borderRadius: "10px", backgroundColor: "lightgrey"}}>
        <pre>{selectedCode}</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
}

export default ProblemSolving;
