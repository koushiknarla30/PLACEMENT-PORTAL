import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Login.css';


function Login() {
  const [uid, setuid] = useState('');
  const [password, setpassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const navi = useNavigate();


  async function npage(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5010', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data === 'exist') {
          if (isAdmin) {
            if (uid === 'CollegeTPO' && password === 'College@TPO') {
              navi('/AdminPage');
            } else {
              setErrorMessage('Invalid Credentials');
            }
          } else {
            if (uid !== 'CollegeTPO') {
              navi(`/Profile/${uid}`, { state: { uid: uid } });
            } else {
              setErrorMessage('Invalid Credentials');
            }
          }
        } else {
          setErrorMessage('Invalid Credentials');
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const switchForm = () => {
    setuid('');
    setpassword('');
    setIsAdmin(!isAdmin);
    setErrorMessage('');
  }
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <div className='login-container'>
      <div className="login-header">
        <h1><strong>Welcome To College Placement Management Portal</strong></h1>
      </div>
      <div className="login-card">
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <div className={`logincard-body ${isAdmin ? 'd-none' : ''}`}>
          <h3 className="logincard-title"><strong>Student Login</strong></h3>
          <form onSubmit={npage}>
            <div className="form-group">
              <label htmlFor="uid">Roll No</label>
              <input style={{ cursor: "text" }} type="text" className="form-control" id="uid" value={uid} onChange={(e) => setuid(e.target.value)} />
            </div>
            <div className="form-group position-relative">
              <label htmlFor="student-pwd">Password</label>
              <input type={passwordShown ? "text" : "password"} className="form-control" id="student-pwd" value={password} onChange={(e) => setpassword(e.target.value)} />
              <i onClick={togglePasswordVisiblity} style={{ position: 'absolute', top: '70%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                {passwordShown ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
              </i>
            </div><br />
            <Link to={'/Forgot'} className="nav-link">Forgot Password</Link>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <button onClick={switchForm} className="btn btn-secondary">Switch to Admin Login</button>
        </div>
        <div className={`logincard-body ${isAdmin ? '' : 'd-none'}`}>
          <h3 className="loginard-title"><strong>Admin Login</strong></h3>
          <form onSubmit={npage}>
            <div className="form-group">
              <label htmlFor="uid">User ID</label>
              <input style={{ cursor: "text" }} type="text" className="form-control" id="id" value={uid} onChange={(e) => setuid(e.target.value)} />
            </div>
            <div className="form-group position-relative">
              <label htmlFor="admin-pwd">Password</label>
              <input type={passwordShown ? "text" : "password"} className="form-control" id="admin-pwd" value={password} onChange={(e) => setpassword(e.target.value)} />
              <i onClick={togglePasswordVisiblity} style={{ position: 'absolute', top: '70%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                {passwordShown ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
              </i>
            </div><br />
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <button onClick={switchForm} className="btn btn-secondary">Switch to Student Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;


