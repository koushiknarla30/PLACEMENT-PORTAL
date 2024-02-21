import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import '../CSS/AddSkills.css';

const AddSkills = () => {
  const {uid} = useParams();
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      const response = await fetch(`/AddSkills/get-skills/${uid}`);
      const data = await response.json();
      if (data) {
        setSkills(data);
        setSkill('');
      } else {
        setSkills([]);
      }
    };
  
    fetchSkills();
  }, [uid]);
  
  const addSkill = async () => {
    if (!skills.includes(skill)) {
      await fetch(`/AddSkills/add-skill/${uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, skill }),
      });

      setSkills([skill, ...skills]);
      setSkill('');
    } else {
      alert('This skill already exists!');
    }
  };

  const deleteSkill = async (skillToDelete) => {
    await fetch(`/AddSkills/delete-skill/${uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uid : uid, skill: skillToDelete }),
    });
    // console.log(skillToDelete);
  
    setSkills(skills.filter(skill => skill !== skillToDelete));
  };
  
  

  const handleSkillClick = (skill) => {
    setSkillToDelete(skill);
    setShowModal(true);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page refresh
    if (skill.trim() !== '') { // Checks if achievement is not empty
      addSkill();
    }
  };

  return (
    <div>
      <Header uid={uid} />
      <h1 style={{marginTop : "20px"}}>Add Skills To Know How Much Skilled You Are</h1>
      <Container className='skill-container'>
        <Row className="justify-content-md-center" md = {2}>
          <Col className='auto'>
            <Card className="card">
              <Card.Header className='card-header'>Your Skills</Card.Header>
              <Card.Body>
                <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
                  {skills && skills.map((skill, index) => (
                    <p key={index} className="skill-name" onClick={() => handleSkillClick(skill)}>
                      {skill}
                    </p>
                  ))}
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control 
                        type="text" 
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        placeholder="Enter New Skill" 
                        required
                        />
                    </Form.Group>
                    <br/>
                    <Button className='add-btn' type="submit">
                        Add Skill
                    </Button>
                </Form>
              </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Skill</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete the skill "{skillToDelete}"?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => { deleteSkill(skillToDelete); setShowModal(false); }}>
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

export default AddSkills;



