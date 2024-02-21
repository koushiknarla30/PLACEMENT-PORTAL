import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { Table, InputGroup, FormControl, Container } from 'react-bootstrap';
import studentData from './studentData.json';

async function fetchSolvedCount(uid) {
  const response = await fetch(`/solvedCount/${uid}`);
  if (!response.ok) {
    return 0;
  }
  const data = await response.json();
  return data.solvedCount || 0;
}

function Leaderboard() {
  const { uid } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all(studentData.map(async student => {
      const solvedCount = await fetchSolvedCount(student.uid);
      return { ...student, solvedCount };
    })).then(studentsWithSolvedCounts => {
      const sortedStudents = studentsWithSolvedCounts.sort((a, b) => {
        if (b.solvedCount - a.solvedCount === 0) {
          return a.uid.localeCompare(b.uid);
        }
        return b.solvedCount - a.solvedCount;
      });
      setStudents(sortedStudents);
    });
  }, []);

  const filteredStudents = students.filter(student => student.uid.includes(search));

  return (
    <div>
    <Header uid={uid} />
    <Container style={{marginTop: "10px", borderRadius: "10px", borderWidth: "2px", borderColor: "black"}}>
      <InputGroup className="search-bar">
        {/* <InputGroup.Text id="basic-addon1">Search</InputGroup.Text> */}
        <FormControl
          placeholder="Search By Roll No"
          aria-label="Search By Roll No"
          aria-describedby="basic-addon1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>
      <Table responsive style={{marginTop: "20px"}}>
        <thead>
          <tr style={{backgroundColor: "#D7DAF2"}}>
            <th>Rank</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Solved Count</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student.uid} style={student.uid === uid ? { backgroundColor: '#f8d7da !important' } : {}}>
              <td>{index + 1}</td>
              <td>{student.uid}</td>
              <td>{student.name}</td>
              <td>{student.Branch}</td>
              <td>{student.solvedCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </div>
  );
}

export default Leaderboard;
