import React from "react";
import AdminHeader from "./AdminHeader";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";


function AdminHome() {
    const CSE = "Computer Science & Engineering";
    const ECE = "Electronics & Communication Engineering";
    const IT = "Information Technology";
    const CSM = "Computer Science & Engineering (AI&ML)";
    const CSC = "Computer Science & Engineering (CyberSecurity)";
    const CSD = "Computer Scinece & Engineering (DataScience)";
        return (
            <div>
                <AdminHeader/>
                <Container>
                    <Row xs={1} md={3}>
                            <Col>
                            <Card style={{borderColor: "black", height: "154px", borderWidth: "2px", backgroundColor: "#f8f9fa"}} className='mb-4'>
                                <Card.Body>
                                <Link className="link" to={`/students/${CSE}`}>
                                    <Card.Title style={{color: "#1F0954"}}>Computer Science & Engineering</Card.Title>
                                </Link>
                                </Card.Body>
                            </Card>
                            </Col>
                            <Col>
                            <Card style={{borderColor: "black", height: "154px", borderWidth: "2px", backgroundColor: "#f8f9fa"}} className='mb-4'>
                                <Card.Body>
                                <Link className="link" to={`/students/${ECE}`}>
                                    <Card.Title style={{color: "#1F0954"}}>Electronics & Communication Engineering</Card.Title>
                                </Link>
                                </Card.Body>
                            </Card>
                            </Col>
                            <Col>
                            <Card style={{borderColor: "black", height: "154px", borderWidth: "2px", backgroundColor: "#f8f9fa"}} className='mb-4'>
                                <Card.Body>
                                <Link className="link" to={`/students/${IT}`}>
                                    <Card.Title style={{color: "#1F0954"}}>Information Technology</Card.Title>
                                </Link>
                                </Card.Body>
                            </Card>
                            </Col>
                        </Row>
                </Container>
            </div>
    );
}

export default AdminHome;