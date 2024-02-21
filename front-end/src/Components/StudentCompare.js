import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Image, Modal, Button } from "react-bootstrap";
import AdminHeader from "./AdminHeader";
import studentData from './studentData.json';
import { Buffer } from 'buffer';

function StudentCompare() {
    const { company, uid } = useParams();
    const [student, setStudent] = useState(null);
    const [skills, setSkills] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [certifications, setCertifications] = useState([]);
    const [resume, setResume] = useState(null);
    const [companyData, setCompany] = useState([]);
    const [showApprovedModal, setShowApprovedModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

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

        const fetchAchievements = async () => {
            const res = await fetch(`/Achievements/get-achievements/${uid}`);
            const data = await res.json();
            if (data) {
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

        const fetchResume = async () => {
            fetch(`/UploadResume/get-resume/${uid}`)
                .then(response => response.blob())
                .then(blob => {
                    if (blob.size > 0) {
                        setResume(URL.createObjectURL(blob));
                    }
                });
        }
        fetchResume();

        const fetchCompany = async () => {
            const res = await fetch(`/CompanyDetails/${company}`);
            const data = await res.json();
            setCompany(data);
        }
        fetchCompany();

    }, [uid]);

    async function handleApprove() {
        try {
            const response = await fetch(`/api/updateStatus/${company}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: uid,
                    status: 'approved',
                }),
            });

            const data = await response.json();
            console.log(data.message);
            setShowApprovedModal(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleReject() {
        try {
            const response = await fetch(`/api/updateStatus/${company}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: uid,
                    status: 'rejected',
                }),
            });
            const data = await response.json();
            console.log(data.message);
            setShowRejectModal(true);
           
        } catch (error) {
            console.error('Error:', error);
        }
    }


    const handleClick = (projects, index) => {
        const project = { projectTitle: projects.projectTitle[index], projectObj: projects.projectObj[index], projectURL: projects.projectURL[index] }
        setSelectedProject(project);
        setShowDetailsModal(true);
    };

    const handleOpen = (bufferData) => {
        const arrayBuffer = new Uint8Array(bufferData);
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };
    function handleWindow(){
        setShowRejectModal(false);
        setShowApprovedModal(false);
        window.location.href = `/studentInterests/${company}`;

    }

    const openResume = (url) => {
        window.open(url, '_blank');
    }


    if (!student) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <AdminHeader />
            <div className="details-container" style={{ display: "flex", justifyContent: "space-between", marginLeft: "20px", marginRight: "20px", marginTop: "30px", height: "auto" }}>
                <div className="cmp-data" style={{ textAlign: "left", borderColor: "black", padding: "70px", borderRight: "2px solid black", marginLeft: "-20px" }}>
                    <h1 style={{ margin: 0 }}>
                        <span>C</span>
                        <h3 style={{ display: 'inline', margin: 0 }}>OMPANY</h3>
                        <span> D</span>
                        <h3 style={{ display: 'inline', margin: 0 }}>ETAILS</h3>
                    </h1>
                    <br />
                    <p>
                        <strong>
                            <span style={{ fontSize: "18px" }}>C</span><span style={{ fontSize: "16px" }}>OMPANY NAME: </span>
                        </strong>
                        {companyData.companyName}
                    </p>
                    <p>
                        <strong>
                            <span style={{ fontSize: "18px" }}>J</span><span style={{ fontSize: "16px" }}>OB TITLE: </span>
                        </strong>
                        {companyData.jobTitle}
                    </p>
                    <p>
                        <strong>
                            <span style={{ fontSize: "18px" }}>R</span><span style={{ fontSize: "16px" }}>EQUIRED SKILLS: </span>
                        </strong>
                        {companyData.reqSkills}
                    </p>
                    <p>
                        <strong>
                            <span style={{ fontSize: "18px" }}>J</span><span style={{ fontSize: "16px" }}>OB CRITERIA: </span>
                        </strong>
                        {companyData.jobCriteria}
                    </p>
                    <p>
                        <strong>
                            <span style={{ fontSize: "18px" }}>P</span><span style={{ fontSize: "16px" }}>ACKAGE: </span>
                        </strong>
                        {companyData.cmpPackage}
                    </p>

                    <p><strong style={{ marginRight: "10px" }}>Download JD:</strong>
                        <Link onClick={() => {
                            const link = document.createElement('a');
                            link.href = `data:${companyData.jobDescriptionFile.contentType};base64,${Buffer.from(companyData.jobDescriptionFile.data).toString('base64')}`;
                            link.download = 'Job Description';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                            style={{ fontSize: "14px", fontWeight: "lighter", color: "blue", textDecoration: "none" }}>
                            Click Here</Link></p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="success" onClick={handleApprove}>Approve</Button>
                        <Button variant="danger" onClick={handleReject}>Reject</Button>
                    </div>
                </div>
                <div className="std-data" >
                    <h1 style={{ margin: 0 }}>
                        <span>S</span>
                        <h3 style={{ display: 'inline', margin: 0 }}>UDENT</h3>
                        <span> D</span>
                        <h3 style={{ display: 'inline', margin: 0 }}>ETAILS</h3>
                    </h1>
                    <div className='first-box' style={{ width: "1000px", height: "auto", marginTop: "30px" }}>
                        <div className='image-box' style={{ width: "300px" }}>
                            <Image src={student.Image} roundedCircle width="200" height="200" className="mb-3" />
                        </div>
                        <div className="std-details" style={{ width: "700px" }}>
                            <h1>{student.name}</h1>
                            <strong className='info' style={{ fontSize: "20px" }}>{student.uid}</strong><br />
                            <strong className='info' style={{ fontSize: "18px" }}>{student.Branch}</strong><br />
                        </div>
                    </div>
                    <div style={{ display: "flex", marginLeft: "420px", marginTop: "-90px" }}>
                        <strong className='data'>B.Tech Percentile:</strong> <p style={{ marginRight: "10px", fontSize: "16px", color: "blue" }}>{student["B.Tech-Percentile"]}</p>
                        <strong className='data'>Active Backlogs:</strong> <p style={{ marginRight: "10px", fontSize: "16px", color: "blue" }}>{student["Active-Backlogs"]}</p>
                        <strong className='data'>Passive Backlogs:</strong> <p style={{ marginRight: "10px", fontSize: "16px", color: "blue" }}>{student["Passive-Blacklogs"]}</p>
                    </div>
                    <div style={{ display: "flex", marginLeft: "380px" }}>
                        <strong className='data'>10th Percentile:</strong> <p style={{ marginRight: "10px", fontSize: "16px", color: "blue" }}>{student["10th-Percentile"]}</p>
                        <strong className='data'>Inter/Diploma Percentile:</strong> <p style={{ marginRight: "10px", fontSize: "16px", color: "blue" }}>{student["Inter/Diploma-Percentile"]}</p>
                        <strong className='data'>EAMCET Rank:</strong> <p style={{ marginRight: "10px", fontSize: "16px", color: "blue" }}>{student["EAMCET-Rank"]}</p>
                    </div>
                    <div style={{ display: "flex", marginLeft: "60%" }}>
                        <Link onClick={() => { openResume(resume) }} style={{ fontSize: "18px", fontWeight: "lighter", color: "green", textDecoration: "none" }}>View Resume</Link>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className='second-box' style={{ marginTop: "20px", marginLeft: "40px", width: "400px", height: "auto" }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                                <h2 style={{ margin: 0 }}>S</h2>
                                <h4 style={{ margin: 0 }}>KILLS</h4>
                            </div>

                            <ul style={{ textAlign: "left" }}>
                                {skills.length > 0 ? (
                                    skills.map((skill, index) => (
                                        <li key={index}>{skill} </li>
                                    ))
                                ) : (
                                    <li style={{ color: "red" }}>Don't Have Any Skill</li>
                                )}
                            </ul>
                        </div>
                        <div className='third-box' style={{ marginTop: "20px", marginRight: "40px", width: "400px", height: "auto" }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                                <h2 style={{ margin: 0 }}>A</h2>
                                <h4 style={{ margin: 0 }}>CHIEVEMENTS</h4>
                            </div>

                            <ul style={{ textAlign: "left" }}>
                                {achievements.length > 0 ? (
                                    achievements.map((achievement, index) => (
                                        <li key={index}>{achievement} </li>
                                    ))
                                ) : (
                                    <li style={{ color: "red" }}>No Achievements</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className='fourth-box' style={{ marginTop: "20px", marginLeft: "40px", width: "400px", height: "auto" }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                                <h2 style={{ margin: 0 }}>C</h2>
                                <h4 style={{ margin: 0 }}>ERTIFICATIONS</h4>
                            </div>

                            <ul style={{ textAlign: "left" }}>
                                {certifications.length > 0 ? (
                                    certifications.map(certification => (
                                        <li key={certification.name}><Link onClick={() => { handleOpen(certification.certificationFile.data) }} style={{ fontSize: "18px", fontWeight: "lighter", color: "black", textDecoration: "none" }}>{certification.name}</Link></li>
                                    ))
                                ) : (
                                    <li style={{ color: "red" }}>No Certifications</li>
                                )}
                            </ul>
                        </div>
                        <div className='fifth-box' style={{ marginRight: "40px", marginTop: "20px", width: "400px", height: "auto" }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', textAlign: "left", marginLeft: "10px" }}>
                                <h2 style={{ margin: 0 }}>P</h2>
                                <h4 style={{ margin: 0 }}>ROJECTS</h4>
                            </div>
                            <ul style={{ textAlign: "left" }}>
                                {projects.projectTitle && projects.projectTitle.length > 0 ? (

                                    projects.projectTitle.map((project, index) => (
                                        <li key={index}><Link onClick={() => { handleClick(projects, index) }} style={{ fontSize: "18px", fontWeight: "lighter", color: "black", textDecoration: "none" }}>{projects.projectTitle[index]}</Link></li>
                                    ))
                                ) : (
                                    <li style={{ color: "red" }}>No Projects</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <Modal className="custom-modal" show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "Highlight", fontWeight: "bold" }}><strong>Project Details</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='project-modal'>
                        <p className='cn-dis'><strong>Project Title:</strong> {selectedProject && selectedProject.projectTitle}</p>
                        <p className='cn-dis'><strong>Project Description:</strong> {selectedProject && selectedProject.projectObj}</p>
                        <p className='cn-dis'><strong>Project URL:</strong> <a style={{ textDecoration: "none" }} href={selectedProject.projectURL} target="_blank">Click Here</a></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='close-btn' onClick={() => setShowDetailsModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal className="custom-modal" show={showApprovedModal} onHide={() => setShowApprovedModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "Highlight", fontWeight: "bold" }}><strong>Approval Status</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='approve-modal'>
                        <p className='cn-dis'>{uid} is Approved</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='close-btn' onClick={() => handleWindow()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal className="custom-modal" show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "Highlight", fontWeight: "bold" }}><strong>Reject Status</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='reject-modal'>
                        <p className='cn-dis'>{uid} is Rejected</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='close-btn' onClick={() => handleWindow()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );

}

export default StudentCompare;