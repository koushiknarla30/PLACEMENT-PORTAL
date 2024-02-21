import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import problems from './ProblemSet.json';
import Editor from '@monaco-editor/react';
import { Spinner, Container, Row, Col, ButtonToolbar, ButtonGroup, Button, Form, Card } from 'react-bootstrap';
import '../CSS/Problem.css'
import SplitPane from 'react-split-pane';


function Problem() {
  const { uid, problemSetId, problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('python'); // Set the default language to JavaScript
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');

const defaultCode = {
      python: `# type your code here`,
      java: `import java.util.*;
import java.lang.*;
import java.io.*;

public class Main {
  //Don't Change the Class Name Main
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
  std::cout << "Hello World!";
  return 0;
}`,
};

  useEffect(() => {
    const problem = problems[problemSetId].find(p => p.id.toString() === problemId);
    setProblem(problem);
    // const storedCode = localStorage.getItem(`code-${problemId}-${language}`);
    setCode(defaultCode[language]);
  }, [problemSetId, problemId, language]);

  const compileAndRun = () => {
    setIsLoading(true);
    fetch('/api/compileAndRun', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, problemId, code, language, input }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.output);
        setIsLoading(false);
      });
  };
  
  const submit = () => {
    setIsLoading(true);
    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, problemId, problemName: problem.problemName, code, language, testCases: problem.testCases }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.message);
        setIsLoading(false);
      });
  };
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage]);
  };
  const switchTheme = () => {
    setTheme(theme === 'light' ? 'vs-dark' : 'light');
  };

  if (!problem) {
    return null;
  }

  return (
    <div>
      <Header uid={uid} />
      <Container fluid style={{marginTop: "10px", marginLeft: "10px", marginRight: "10px", marginBottom: "10px", overflowY: "scroll" }}>
        <Row>
        <Col md={6} style={{ border: '2px solid black', borderRadius: "10px", padding: '10px' }}>
          <div style={{textAlign: "left"}}>
            <strong style={{fontSize: "30px", fontWeight: "lighter", color: "#1F0954"}}>{problem.problemName}</strong>
            <p><strong>Problem Statement:</strong><br/> 
              {problem.problemStatement.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <p><strong>Constraints:</strong><br/> 
              {problem.constraints.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <p><strong>Sample Input:</strong><br/> 
              {problem.sampleInput.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <p><strong>Sample Output:</strong><br/> 
                <React.Fragment>
                  <pre style={{fontFamily: 'inherit', fontSize: "16px"}}>{problem.sampleOutput}</pre>
                  <br />
                </React.Fragment>
            </p>
          </div>
        </Col>

          <Col md={6} style={{ border: '2px solid black', borderRadius: "10px", padding: '10px' }}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
            <Form.Select style={{width: "120px"}} aria-label="Language Select" onChange={handleLanguageChange}>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </Form.Select>
            <Button onClick={switchTheme}>Switch Theme</Button>
            </div>
            <div style={{ border: '2px solid black', borderRadius: "10px", height: "400px", marginTop: '10px', marginBottom: '10px', backgroundColor: "#332D2D" }}>
              <Editor
                theme={theme}
                height="50vh"
                defaultLanguage={language}
                value={code}
                onChange={setCode}
                options={{ minimap: { enabled: false }, padding: { top: 15 }, fontSize: 18, scrollBeyondLastLine: false, automaticLayout: true  }}
                
              />
            </div>
            <ButtonToolbar aria-label="Toolbar with button groups" style={{alignItems: "end"}}>
                <ButtonGroup className="me-3" aria-label="First group">
                  <Button onClick={compileAndRun}>Compile & Run</Button>
                </ButtonGroup>
                <ButtonGroup aria-label="Second group">
                  <Button variant='success' onClick={submit}>Submit</Button>
                </ButtonGroup>
              </ButtonToolbar>
            {/* <div style={{display: "flex", justifyContent: "space-between"}}>
                
                <Button variant="primary" onClick={compileAndRun} id="custom-button">Compile & Run</Button>
                <Button variant='success' onClick={submit} id="custom-button">Submit</Button>
            </div> */}
            <Row style={{ marginTop: "-110px", display: "flex", justifyContent: "space-between", marginLeft: "25px" }} xs={1} md={2}>
              <Col>
                <Card style={{width: "300px", height: "200px"}}>
                  <Card.Header>Custom Input</Card.Header>
                  <Card.Body>
                    <Form.Control as="textarea" rows={3} onChange={(e) => setInput(e.target.value)} value={input} />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
              <Card style={{width: "300px", height: "200px"}}>
  <Card.Header>Output</Card.Header>
  <Card.Body style={{textAlign: "left"}}>
    {isLoading ? <Spinner animation="border" /> : 
      <p style={output !== 'Accepted' ? { color: 'red' } : { color: 'green' }}>
        {output}
      </p>
    }
  </Card.Body>
</Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Problem;