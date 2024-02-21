import React, { useState, useEffect } from 'react';
import Header from './Header';
import studentData from './studentData.json';
import { Link } from 'react-router-dom';
import { Image, Modal, Button } from 'react-bootstrap';
import '../CSS/Home.css';

function Home({ uid }) {
  const [student, setStudent] = useState(null);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
      const student = studentData.find(student => student.uid === uid);
      setStudent(student);
  
      const fetchSkills = async () => {
        const response = await fetch(`/AddSkills/get-skills/${uid}`);
        const data = await response.json();
        if (data) {
          setSkills(data);
        }
      };
      fetchSkills();
  
      const fetchAchievements = async() => {
        const res = await fetch(`/Achievements/get-achievements/${uid}`);
        const data = await res.json();
        if(data) {
          setAchievements(data);
        }
      };
      fetchAchievements();
      const fetchProjects = () => {
          fetch(`/get-projects/${uid}`)
              .then(response => response.json())
              .then(data => {
                  setProjects(data);
              })
      };
      fetchProjects();

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

    const handleClick = (projects, index) => {
      const project = {projectTitle: projects.projectTitle[index], projectObj: projects.projectObj[index], projectURL: projects.projectURL[index]}
      setSelectedProject(project);
      setShowDetailsModal(true);
    };

    const handleOpen = (bufferData) => {
      const arrayBuffer = new Uint8Array(bufferData);
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
  
  
    if (!student) {
      return <div>Loading...</div>;
    }

  return (
      <div>
          <Header uid={uid}/>
          
          <div className="border border-secondary" style={{marginLeft: "250px", marginRight: "50px", marginTop: "50px", borderRadius: "10px", borderWidth: "3px", borderColor: "black", height: "1000px", width: "1000px"}}>
              <div className='first-box' style={{width: "1000px", height: "auto"}}>
                  <div className='image-box' style={{width: "300px"}}>
                      <Image src={student.Image} roundedCircle width="200" height="200" className="mb-3" />
                  </div>
                  <div className="std-details" style={{width: "700px"}}>
                      <h1>{student.name}</h1>
                      <strong className='info' style={{fontSize: "20px"}}>{student.uid}</strong><br/>
                      <strong className='info' style={{fontSize: "18px"}}>{student.Branch}</strong><br/>
                  </div>
              </div>
              <div style={{display: "flex", marginLeft: "420px", marginTop: "-90px"}}>
                  <strong className='data'>B.Tech Percentile:</strong> <p style={{marginRight: "10px", fontSize: "16px", color: "blue"}}>{student["B.Tech-Percentile"]}</p>
                  <strong className='data'>Active Backlogs:</strong> <p style={{marginRight: "10px", fontSize: "16px", color: "blue"}}>{student["Active-Backlogs"]}</p>
                  <strong className='data'>Passive Backlogs:</strong> <p style={{marginRight: "10px", fontSize: "16px", color: "blue"}}>{student["Passive-Blacklogs"]}</p>
              </div>
              <div style={{display: "flex", marginLeft: "380px"}}>
                  <strong className='data'>10th Percentile:</strong> <p style={{marginRight: "10px", fontSize: "16px", color: "blue"}}>{student["10th-Percentile"]}</p>
                  <strong className='data'>Inter/Diploma Percentile:</strong> <p style={{marginRight: "10px", fontSize: "16px", color: "blue"}}>{student["Inter/Diploma-Percentile"]}</p>
                  <strong className='data'>EAMCET Rank:</strong> <p style={{marginRight: "10px", fontSize: "16px", color: "blue"}}>{student["EAMCET-Rank"]}</p>
              </div>
              <div style={{display: "flex", justifyContent:"space-between"}}>
              <div className='second-box' style={{ marginTop: "20px", marginLeft: "40px", width: "400px", height: "auto"}}>
                  <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                      <h2 style={{ margin: 0 }}>S</h2>
                      <h4 style={{ margin: 0 }}>KILLS</h4>
                  </div>

                  <ul style={{textAlign: "left"}}>
                      {skills.length > 0 ? (
                          skills.map((skill, index) => (
                              <li key={index}>{skill} </li>
                          ))
                          ) : (
                          <li style={{color: "red"}}>Don't Have Any Skill</li>
                          )}
                  </ul>
              </div>
              <div className='third-box' style={{ marginTop: "20px", marginRight: "40px", width: "400px", height: "auto"}}>
                  <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                      <h2 style={{ margin: 0 }}>A</h2>
                      <h4 style={{ margin: 0 }}>CHIEVEMENTS</h4>
                  </div>

                  <ul style={{textAlign: "left"}}>
                      {achievements.length > 0 ? (
                          achievements.map((achievement, index) => (
                              <li key={index}>{achievement} </li>
                          ))
                          ) : (
                          <li style={{color: "red"}}>No Achievements</li>
                          )}
                  </ul>
              </div>
              </div>
              <div style={{display: "flex", justifyContent:"space-between"}}>
              <div className='fourth-box' style={{ marginTop: "20px", marginLeft: "40px", width: "400px", height: "auto"}}>
                  <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                      <h2 style={{ margin: 0 }}>C</h2>
                      <h4 style={{ margin: 0 }}>ERTIFICATIONS</h4>
                  </div>

                  <ul style={{textAlign: "left"}}>
                      {certifications.length > 0 ? (
                          certifications.map(certification => (
                              <li key={certification.name}><Link onClick={() =>{handleOpen(certification.certificationFile.data)}} style={{fontSize: "18px", fontWeight: "lighter", color: "black", textDecoration: "none"}}>{certification.name}</Link></li>
                          ))
                          ) : (
                              <li style={{color: "red"}}>No Certifications</li>
                          )}
                  </ul>
              </div>
              <div className='fifth-box' style={{ marginRight: "40px", marginTop: "20px", width: "400px", height: "auto"}}>
                  <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                      <h2 style={{ margin: 0 }}>P</h2>
                      <h4 style={{ margin: 0 }}>ROJECTS</h4>
                  </div>
                  <ul style={{textAlign: "left"}}>
                  {projects.projectTitle && projects.projectTitle.length > 0 ? (
                      
                          projects.projectTitle.map((project, index) => (
                          <li key={index}><Link onClick={() =>{handleClick(projects,index)}} style={{fontSize: "18px", fontWeight: "lighter", color: "black", textDecoration: "none"}}>{projects.projectTitle[index]}</Link></li>
                          ))
                      ) : (
                      <li style={{color: "red"}}>No Projects</li>
                      )}
                  </ul>
              </div>
              </div>
          </div>
          <Modal className="custom-modal" show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
              <Modal.Header closeButton>
                  <Modal.Title style={{color : "Highlight", fontWeight : "bold"}}><strong>Project Details</strong></Modal.Title>
              </Modal.Header>
              <Modal.Body className='project-modal'>
                  <p className='cn-dis'><strong>Project Title:</strong> {selectedProject && selectedProject.projectTitle}</p>
                  <p className='cn-dis'><strong>Project Description:</strong> {selectedProject && selectedProject.projectObj}</p>
                  <p className='cn-dis'><strong>Project URL:</strong> <a style={{textDecoration: "none"}} href={selectedProject.projectURL} target="_blank">Click Here</a></p>
              </Modal.Body>
              <Modal.Footer>
                  <Button className='close-btn' onClick={() => setShowDetailsModal(false)}>
                  Close
                  </Button>
              </Modal.Footer>
          </Modal>
      </div>
  );
}

export default Home;