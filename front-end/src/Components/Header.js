import React from 'react';
import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import studentData from './studentData.json';
import '../CSS/Header.css';

const Header = ({ uid }) => {
  const student = studentData.find(student => student.uid === uid);

  return (
    <Navbar className='custom-navbar'>
      <Nav className="mr-auto">
        <Link to={`/Profile/${uid}`} className="nav-link"><strong>Home</strong></Link>
        <Link to={`/AddSkills/${uid}`} className="nav-link"><strong>Skills</strong></Link>
        <Link to={`/Achievements/${uid}`} className="nav-link"><strong>Achievements</strong></Link>
        <Link to={`/AddCertifications/${uid}`} className="nav-link"><strong>Certifications</strong></Link>
        <Link to={`/MyProjects/${uid}`} className="nav-link"><strong>Projects</strong></Link>
        <Link to={`/UploadResume/${uid}`} className="nav-link"><strong>Resume</strong></Link>
        <Link to={`/Jobs/${uid}`} className="nav-link"><strong>Job Opportunities</strong></Link>
        <Link to={`/ProblemSolving/${uid}`} className="nav-link"><strong>Problems</strong></Link>
        <Link to={`/Leaderboard/${uid}`} className="nav-link"><strong>Leaderboard</strong></Link>
      </Nav>
      <Navbar.Collapse className="nav-bar">
        <Navbar.Text>
        <strong className='u-id'>{uid}</strong>
        </Navbar.Text>
        
        <Navbar.Brand>
          <Dropdown drop='left'>
            <Dropdown.Toggle className='profile-icon' as={Image} src={student.Image} roundedCircle width="30" height="30" />

            <Dropdown.Menu className='drop-menu'>
            <Dropdown.Item  className="custom-item -button"  href="/forgot">forgot password</Dropdown.Item>
              <Dropdown.Item  className="custom-item logout-button" href="/">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Brand>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;



