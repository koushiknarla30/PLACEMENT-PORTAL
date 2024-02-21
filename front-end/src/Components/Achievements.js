import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import '../CSS/Achievements.css';

const Achievements = () => {
  const {uid} = useParams();
  const [achievement, setAchievement] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      const response = await fetch(`/Achievements/get-achievements/${uid}`);
      const data = await response.json();
      if (data) {
        setAchievements(data);
        setAchievement('');
      } else {
        setAchievements([]);
      }
    };
  
    fetchAchievements();
  }, [uid]);
  
  const addAchievement = async () => {
    if (!achievements.includes(achievement)) {
      await fetch(`/Achievements/add-achievement/${uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, achievement }),
      });

      setAchievements([achievement, ...achievements]);
      setAchievement('');
    } else {
      alert('This Achievement already exists!');
    }
  };

  const deleteAchievement = async (achievementToDelete) => {
    await fetch(`/Achievements/delete-achievement/${uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uid : uid, achievement: achievementToDelete }),
    });
    // console.log(skillToDelete);
  
    setAchievements(achievements.filter(achievement => achievement !== achievementToDelete));
  };
  
  

  const handleSkillClick = (achievement) => {
    setAchievementToDelete(achievement);
    setShowModal(true);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page refresh
    if (achievement.trim() !== '') { // Checks if achievement is not empty
      addAchievement();
    }
  };

  return (
    <div>
      <Header uid={uid} />
      <h1 style={{marginTop : "20px"}}>Mention Your Achievements</h1>
      <Container className='achieve-container'>
        <Row className="justify-content-md-center" md = {2}>
          <Col className='auto'>
            <Card className="card">
              <Card.Header className='card-header'>Your Achievements</Card.Header>
              <Card.Body>
                <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
                  {achievements && achievements.map((achievement, index) => (
                    <ul key={index} className="achievement-name" onClick={() => handleSkillClick(achievement)}>
                      <li>{achievement}</li>
                    </ul>
                  ))}
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control 
                        type="text" 
                        value={achievement}
                        onChange={(e) => setAchievement(e.target.value)}
                        placeholder="Add Achievement" 
                        required
                        />
                    </Form.Group>
                    <br/>
                    <Button className='add-btn' type="submit">
                        Add Achievement
                    </Button>
                </Form>
              </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Achievement</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete the Achievement "{achievementToDelete}"?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => { deleteAchievement(achievementToDelete); setShowModal(false); }}>
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

export default Achievements;



