import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import problems from './ProblemSet.json';
import '../CSS/ProblemSet.css'

function ProblemSet() {
  const { uid, problemSetId } = useParams();
  const [problem, setProblems] = useState([]);

  useEffect(() => {
    // Fetch the problems from your JSON file
    setProblems(problems[problemSetId])
    // fetch('./ProblemSet.json')
    //   .then((response) => response.json())
    //   .then((data) => setProblems(data[problemSetId]));
  }, [problemSetId]);

  return (
    <div>
      <Header uid={uid} />
      <div style={{marginTop: "50px", borderColor: "black", borderWidth: "2px", marginLeft: "200px", marginRight: "200px", marginBottom: "100px", overflowY: "scroll", width: "1100px", maxHeight: "fit-content"}} className="card">
        <ol className="list-group">
          {problem.map((problem, index) => (
            <li style={{marginTop: "10px"}} key={index} >
              <Link className="link" to={`/${uid}/problems/${problemSetId}/${problem.id}`}>
              {index + 1}.  {problem.problemName}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ProblemSet;
