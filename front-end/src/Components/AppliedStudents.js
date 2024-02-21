import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import { useParams, Link } from "react-router-dom";
import studentData from './studentData.json';
import { Container, InputGroup, Table, FormControl, Tabs, Tab } from "react-bootstrap";

function AppliedStudents() {

    const { company } = useParams();
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            const res = await fetch(`/AppliedStudents/${company}`);
            const data = await res.json();
            setStudents(data);
        }
        fetchStudents();
    }, [company]);

    const filteredStudents = students.filter(student => student.studentId.includes(search));

    const approvedStudents = filteredStudents.filter(student => student.status === 'approved');
    const pendingStudents = filteredStudents.filter(student => student.status === 'pending');
    const rejectedStudents = filteredStudents.filter(student => student.status === 'rejected');
    const notAppliedStudents = studentData.filter(student => !students.some(s => s.studentId === student.uid));

    return (
        <div>
            <AdminHeader />
            <Container>
                <InputGroup style={{ marginTop: "20px" }} className="search-bar">
                    <FormControl
                        placeholder="Search By Roll No"
                        aria-label="Search By Roll No"
                        aria-describedby="basic-addon1"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </InputGroup>
                <br />
                <Tabs defaultActiveKey="approved" className="tab-bar"
                    id="justify-tab-example"
                    justify>
                    <Tab eventKey="approved" title="Approved">
                        <StudentTable students={approvedStudents} company={company} />
                    </Tab>
                    <Tab eventKey="pending" title="Pending">
                        <StudentTable students={pendingStudents} company={company} />
                    </Tab>
                    <Tab eventKey="rejected" title="Rejected">
                        <StudentTable students={rejectedStudents} company={company} />
                    </Tab>
                    <Tab eventKey="notInterested" title="Select">
                        <StudentTableName students={notAppliedStudents} company={company} />
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
}

function StudentTable({ students, company }) {
    return (
        <Table responsive style={{ marginTop: "20px" }}>
            <thead>
                <tr style={{ backgroundColor: "#D7DAF2" }}>
                    <th>S.No</th>
                    <th>Roll No</th>
                </tr>
            </thead>
            <tbody>
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <tr key={student.studentId}>
                            <td>{index + 1}</td>
                            <td>
                                <Link style={{ fontSize: "16px", fontWeight: "lighter", color: "blue" }} className="link" to={`/studentInterests/${company}/${student.studentId}`}>
                                    {student.studentId}
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" style={{ textAlign: "center", color: "red", fontSize: "18px" }}>No Student Found</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}
function StudentTableName({ students, company }) {
    return (
        <Table responsive style={{ marginTop: "20px" }}>
            <thead>
                <tr style={{ backgroundColor: "#D7DAF2" }}>
                    <th>S.No</th>
                    <th>Roll No</th>
                </tr>
            </thead>
            <tbody>
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <tr key={student.uid}>
                            <td>{index + 1}</td>
                            <td>
                                <Link style={{ fontSize: "16px", fontWeight: "lighter", color: "blue" }} className="link" to={`/studentInterests/${company}/${student.uid }`}>
                                    {student.uid}
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" style={{ textAlign: "center", color: "red", fontSize: "18px" }}>No Student Found</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}


export default AppliedStudents;
