import React, { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import studentData from './studentData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



function ForgotPwd() {
    const [rollno, setRollno] = useState('');
  const [fathernumber, setFathernumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const handleClose = () => {
    setShow(false);
    if (modalMessage === 'Password updated successfully') {
      window.location.href = '/';
    }
  };
  
  const handleShow = (message) => {
    setModalMessage(message);
    setShow(true);
  };


  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const student = studentData.find(student => student.uid === rollno && student.FatherNo === fathernumber);

        if (!student) {
            handleShow('Invalid details');
            return;
        }

        if (password !== confirmPassword) {
            handleShow('Passwords do not match');
            return;
        }

        // Call the API to update the password
        try {
            const response = await fetch('/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: rollno,
                    password: password,
                }),
            });

            if (response.ok) {
                handleShow('Password updated successfully');
            } else {
                handleShow('An error occurred while updating the password');
            }
        } catch (error) {
            console.error('Error:', error);
            handleShow('An error occurred while updating the password');
        }
    };

    return (
        <Container style={{ border: '2px solid black', padding: '20px', borderRadius: '5px', marginTop: '100px', maxWidth: '500px' }}>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRollNo">
                  <Form.Label>Roll No:</Form.Label>
                  <Form.Control type="text" value={rollno} onChange={(e) => setRollno(e.target.value)} />
                </Form.Group>
    
                <Form.Group controlId="formFathersNumber">
                  <Form.Label>Father's Number:</Form.Label>
                  <Form.Control type="text" value={fathernumber} onChange={(e) => setFathernumber(e.target.value)} />
                </Form.Group>
    
                <Form.Group controlId="formPassword" className="position-relative">
              <Form.Label>Password:</Form.Label>
              <Form.Control type={passwordShown ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <FontAwesomeIcon onClick={togglePasswordVisibility} icon={passwordShown ? faEye : faEyeSlash} style={{ position: 'absolute', top: '70%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }} />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="position-relative">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control type={confirmPasswordShown ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <FontAwesomeIcon onClick={toggleConfirmPasswordVisibility} icon={confirmPasswordShown ? faEye : faEyeSlash} style={{ position: 'absolute', top: '70%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }} />
            </Form.Group>
            <br/>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
    
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Container>
      );
    }
    
    export default ForgotPwd;