import React, {useState, useEffect} from "react";
import AdminHeader from "./AdminHeader";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

function StudentInterests() {

    const [companies, setCompanies] = useState([]);

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

    return (
        <div>
            <AdminHeader/>
            <Container>
                <Row xs={1} md={3}>
                    {companies.map((company, index) => (
                        <Col key={index}>
                            <Card style={{borderColor: "black", height: "130px", borderWidth: "2px", backgroundColor: "#f8f9fa"}} className='mb-4'>
                                <Card.Body>
                                    <Link className="link" to={`/studentInterests/${company.companyName}`}>
                                        <Card.Title style={{color: "#1F0954"}}>{company.companyName}</Card.Title>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default StudentInterests;
