import React from 'react';
import { Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminHeader = () => {

  return (
    <Navbar className='custom-navbar'>
      <Nav style={{marginLeft: "40px"}} className="mr-auto">
      <Link to={`/AdminPage`} className="nav-link"><strong>Home</strong></Link>
        {/* <Link to={`/StudentDetails`} className="nav-link"><strong>View Student Details</strong></Link> */}
        <Link to={`/StudentLeaderboard`} className="nav-link"><strong>Leaderboard</strong></Link>
        <Link to={`/StudentInterests`} className="nav-link"><strong>View Student Interests</strong></Link>
        <Link to={`/ViewCompanies`} className="nav-link"><strong>View Companies</strong></Link>
        <Link to={`/AddCompanies`} className="nav-link"><strong>Add Companies</strong></Link>
      </Nav>
      <Navbar.Collapse className="nav-bar">
        <Navbar.Text>
        <strong className='u-id'>College TPO</strong>
        </Navbar.Text>
        
        <Navbar.Brand>
          <Dropdown drop='left'>
            <Dropdown.Toggle className='profile-icon' as={Image} src='/Male.jpg' roundedCircle width="30" height="30" />

            <Dropdown.Menu className='drop-menu'>
              <Dropdown.Item  className="custom-item logout-button"  href="/">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Brand>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminHeader;



