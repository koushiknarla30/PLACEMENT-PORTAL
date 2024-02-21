// import React, { useState } from 'react';
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Profile from './Components/Profile';
import Login from './Components/Login';
import AdminPage from './Components/AdminPage';
import AddSkills from './Components/AddSkills';
import AddCertifications from './Components/AddCertifications';
import Jobs from './Components/Jobs';
import Leaderboard from './Components/Leaderboard';
import './App.css';
import Achievements from './Components/Achievements';
import AddCompanies from './Components/AddCompanies';
import ViewCompanies from './Components/ViewCompanies';
import UploadResume from './Components/UploadResume';
import ProblemSolving from './Components/ProblemSolving';
import ProblemSet from './Components/ProblemSet';
import Problem from './Components/Problem';
import StudentProjects from './Components/StudentProjects';
import StudentBranch from './Components/StudentBranch';
import StudentDetails from './Components/StudentDetails';
import AdminLeaderboard from './Components/AdminLeaderboard';
import StudentInterests from './Components/StudentInterests';
import AppliedStudents from './Components/AppliedStudents';
import StudentCompare from './Components/StudentCompare';
import ForgotPwd from './Components/ForgotPwd';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path = '/' element = {<Login/>}></Route>
        <Route path = '/Profile/:uid' element = {<Profile/>}></Route>
        <Route path = '/AdminPage' element = {<AdminPage/>}></Route>
        <Route path = '/AddSkills/:uid' element={<AddSkills/>}></Route>
        <Route path = '/Achievements/:uid' element={<Achievements/>}></Route>
        <Route path = '/AddCertifications/:uid' element={<AddCertifications/>}></Route>
        <Route path = '/MyProjects/:uid' element = {<StudentProjects/>}></Route>
        <Route path = '/Jobs/:uid' element={<Jobs/>}></Route>
        <Route path = '/ProblemSolving/:uid' element={<ProblemSolving/>}></Route>
        <Route path = '/:uid/problems/:problemSetId' element={<ProblemSet/>}></Route>
        <Route path = '/:uid/problems/:problemSetId/:problemId' element={<Problem/>}></Route>
        <Route path = '/Leaderboard/:uid' element={<Leaderboard/>}></Route>
        <Route path = '/AddCompanies' element = {<AddCompanies/>}></Route>
        <Route path = '/ViewCompanies' element = {<ViewCompanies/>}></Route>
        <Route path = '/UploadResume/:uid' element = {<UploadResume/>}></Route>
        <Route path = '/students/:stream' element = {<StudentBranch/>}></Route>
        <Route path = '/students/:stream/:uid' element = {<StudentDetails/>}></Route>
        <Route path = '/StudentLeaderboard' element = {<AdminLeaderboard/>}></Route>
        <Route path = '/StudentInterests' element = {<StudentInterests/>}></Route>
        <Route path = '/studentInterests/:company' element = {<AppliedStudents/>}></Route>
        <Route path = '/studentInterests/:company/:uid' element = {<StudentCompare/>}></Route>
        <Route path = '/forgot' element={<ForgotPwd/>}></Route>
      </Routes>
    </div>
  )
}

export default App;
