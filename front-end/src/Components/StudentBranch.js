import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import studentData from './studentData.json';
import { useParams, Link } from "react-router-dom";
import { Container, Table, InputGroup, FormControl } from "react-bootstrap";

function StudentBranch() {
    const {stream} = useParams();
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const student = studentData.filter(student => student.Branch === stream);
        const sortedStudents = student.sort((a, b) => {
            return a.uid.localeCompare(b.uid);
          });
          setStudents(sortedStudents);
    }, [stream]);

    const binarySearch = (students, uid) => {
        let start = 0;
        let end = students.length - 1;

        while (start <= end) {
            let mid = Math.floor((start + end) / 2);

            if (students[mid].uid === uid) {
                return [students[mid]];
            } else if (students[mid].uid < uid) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }
        return [];
    }
    // const filteredStudents = students.filter(student => student.uid.includes(search));

    const filteredStudents = search ? binarySearch(students, search) : students;

    return (
        <div>
            <AdminHeader/>
            <h2 style={{marginTop: "20px", color: "#1F0954"}}>{stream}</h2>
            <Container style={{marginTop: "20px", marginLeft: "50px", marginRight: "50px"}}>
                <InputGroup className="search-bar">
                    <FormControl
                    placeholder="Search By Roll No"
                    aria-label="Search By Roll No"
                    aria-describedby="basic-addon1"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    />
                </InputGroup>
                <Table style={{marginTop: "15px"}} responsive>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Roll No</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, index) => (
                            <tr key={student.uid} style={student.Branch === stream ? { backgroundColor: '#f8d7da !important' } : {}}>
                            <td>{index + 1}</td>
                            <td><Link style={{fontSize: "16px", fontWeight: "lighter", color: "blue"}} className="link" to={`/students/${stream}/${student.uid}`}>{student.uid}</Link></td>
                            <td>{student.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

export default StudentBranch;
