import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import loginModel from "./models/loginModel.js";
import skillModel from './models/skillModel.js';
import achieveModel from './models/achieveModel.js';
import companyModel from "./models/companyModel.js";
import path from "path";
import bodyParser from 'body-parser';
import multer from 'multer';
import { config } from "dotenv";
import stdinterestModel from "./models/stdinterestModel.js";
import certificationModel from "./models/certificationModel.js";
import resumeModel from "./models/resumeModel.js";
import codeSubmissionModel from "./models/codeSubmission.js";
import solCountModel from "./models/solCountModel.js";
import os from "os";
import { spawn } from 'child_process';
import fs from 'fs';
import validator from 'validator';
import stdProjectModel from "./models/stdProjectModel.js";

config();


const app = express();
app.use(cors());
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
});
app.use(bodyParser.json());
// app.use(cors(
//   {
//     origin : ["https://placement-management-portal.vercel.app/"],
//     methods : ["POST", "GET"],
//     credentials: true
//   }
// ));
app.use(express.json());
// const submissionSchema = new mongoose.Schema({
//   uid: String,
//   problemId: Number,
//   problemName: String,
//   code: [String],
//   status: [String],
// });

// const studentSchema = new mongoose.Schema({
//   uid: String,
//   solved: Number,
// });

// const Submission = mongoose.model('Submission', submissionSchema);
// const Student = mongoose.model('Student', studentSchema);


const port = process.env.PORT || 5010;


app.post('/', async (req, res) => {
    const { uid, password } = req.body;

    try {
        const check = await loginModel.findOne({ uid, password });
        if (check) {
            res.json("exist");
        } else {
            res.json("notexist");
        }
    } catch (e) {
        res.json("notexist");
    }
});

app.get('/AddSkills/get-skills/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    let student = await skillModel.findOne({ uid });

    if (!student) {
      student = new skillModel({ uid, skills: [] });
      await student.save();
    }

    res.json(student.skills);
  } catch (e) {
    console.log(e);
    res.status(500).json('Error getting skills');
  }
});

app.post('/AddSkills/add-skill/:uid', async (req, res) => {
  const { uid, skill } = req.body;

  try {

    let student = await skillModel.findOne({ uid });

    if (!student) {
      student = new skillModel({ uid, skills: [] });
      await student.save();
    }
    if (student.skills.includes(skill)) {
      res.json('This skill already exists!');
    } else {
      
      student.skills.push(skill);
      await student.save();
      res.json('Skill added successfully');
    }
  } catch (e) {
    res.json('Error adding skill');
  }
});

app.delete('/AddSkills/delete-skill/:uid', async (req, res) => {
  const { uid } = req.params;
  const { skill } = req.body;
  try {
    let student = await skillModel.findOne({ uid });

    if (!student) {
      res.status(404).json('Student not found');
    } else {
      student.skills = student.skills.filter(s => s !== skill);
      await student.save();
      res.json('Skill deleted successfully');
    }
  } catch (e) {
    res.status(500).json('Error deleting skill');
  }
});


app.get('/Achievements/get-achievements/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    let student = await achieveModel.findOne({ uid });

    if (!student) {
      student = new achieveModel({ uid, skills: [] });
      await student.save();
    }

    res.json(student.achievements);
  } catch (e) {
    console.log(e);
    res.status(500).json('Error getting achievements');
  }
});

app.post('/Achievements/add-achievement/:uid', async (req, res) => {
  const { uid, achievement } = req.body;

  try {
    let student = await achieveModel.findOne({ uid });

    if (!student) {
      student = new achieveModel({ uid, achievements: [] });
      await student.save();
    }
    if (student.achievements.includes(achievement)) {
      res.json('This Achievement already exists!');
    } else {
      student.achievements.push(achievement);
      await student.save();
      res.json('Achievement added successfully');
    }
  } catch (e) {
    res.json('Error adding Achievement');
  }
});

app.delete('/Achievements/delete-achievement/:uid', async (req, res) => {
  const { uid } = req.params;
  const { achievement } = req.body;
  try {
    let student = await achieveModel.findOne({ uid });

    if (!student) {
      res.status(404).json('Student not found');
    } else {
      student.achievements = student.achievements.filter(a => a !== achievement);
      await student.save();
      res.json('Achievement deleted successfully');
    }
  } catch (e) {
    res.status(500).json('Error deleting achievement');
  }
});

app.get('/ViewCompanies/get-companies', async (req, res) => {
  const companies = await companyModel.find({});

  res.json(companies);
});

app.post('/AddCompanies/add-company', upload.any(), async (req, res) => {
  const { companyName, jobTitle, reqSkills, jobCriteria, cmpPackage } = req.body;
  const file = req.files[0];
  console.log(req.files);
  
  const company = new companyModel({
    companyName,
    jobTitle,
    reqSkills,
    jobCriteria,
    cmpPackage,
    jobDescriptionFile: {
      data: file.buffer,
      contentType: file.mimetype
    }
  });

  try {
    const savedCompany = await company.save();
    res.json({ message: 'Company added successfully', company: savedCompany });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add company', error: err.message });
  }
});

app.delete('/ViewCompanies/delete-company/:companyToDelete', async (req, res) => {
  const { companyToDelete } = req.params;
  
  try {
    await companyModel.deleteOne({ companyName: companyToDelete });
    await stdinterestModel.deleteOne({companyName: companyToDelete});
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete company', error: err.message });
  }
});

app.get('/StdInterests/get-stdinterest/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const studentInterests = await stdinterestModel.find({ "students.studentId": uid });
    if (!studentInterests.length) {
        return res.json([]);
    }
    const companyDetails = await Promise.all(studentInterests.map(async (interest) => {
        const company = await companyModel.findOne({ companyName: interest.companyName });
        const student = interest.students.find(student => student.studentId === uid);
        return { ...company._doc, status: student.status };
    }));
    res.json(companyDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/Apply/std', async (req, res) => {
  const { companyName, uid } = req.body;
  try {
    let stdInterest = await stdinterestModel.findOne({ companyName });
    if (!stdInterest) {
      stdInterest = new stdinterestModel({ companyName, students: [] });
      await stdInterest.save();
    }
    if (stdInterest.students.find(student => student.studentId === uid)) {
      res.json('You have already Applied!');
    } else {
      stdInterest.students.push({ studentId: uid, status: 'pending' });
      await stdInterest.save();
      res.json('Applied Successfully');
    }
  } catch (e) {
    res.json('Error in Applying');
  }
});

// app.get('/StudentInterests/:companyName', async (req, res) => {
//   try {
//     const companyName = req.params.companyName;
//     const studentInterests = await stdinterestModel.findOne({ companyName: companyName });
//     if (studentInterests) {
//       const pendingStudents = studentInterests.students.filter(student => student.status === 'pending');
//       res.json(pendingStudents);
//     } else {
//       res.json([]);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
app.get('/AppliedStudents/:companyName', async(req,res)=>{
  try{
    const companyName = req.params.companyName;
    const studentInterests = await stdinterestModel.findOne({ companyName: companyName });
    if (studentInterests) {
      res.json(studentInterests.students);
    } else {
      res.json([]);
    }
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

app.get('/CompanyDetails/:company', async (req, res) => {
  try {
    const companyName = req.params.company;
    const companyData = await companyModel.findOne({ companyName: companyName});
    res.json(companyData);
  } catch(err) {
    res.json({message: "Server Error"})
  }
});

app.post('/api/updateStatus/:company', async (req, res) => {
  const companyName = req.params.company;
  const { studentId, status } = req.body;
  try {
    let stdInterest = await stdinterestModel.findOne({ companyName: companyName });
    if (!stdInterest) {
      return res.json({ message: companyName });
    }

    let student = stdInterest.students.find(student => student.studentId === studentId);
    if(!student){
      stdInterest.students.push({ studentId: studentId, status: status });
      await stdInterest.save();
      res.json({message:`${status} Sucessfully`});
    }
    else{
    student.status = status;

    await stdInterest.save();
    res.json({ message: 'Status updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/AddCertifications/get-certifications/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;

    let certification = await certificationModel.findOne({ uid });

    if (!certification) {
      res.json([]);
    } else {
      res.json(certification.certifications);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/UploadResume/get-resume/:uid', async (req, res) => {
  try {
      const doc = await resumeModel.findOne({ uid: req.params.uid });
      if (!doc) {
          res.send('No resume found');
      } else {
          res.contentType(doc.resume.contentType);
          res.send(doc.resume.data);
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

app.post('/UploadResume/upload/:uid', upload.single('resume'), async (req, res) => {
  try {
      const doc = await resumeModel.findOneAndUpdate(
          { uid: req.params.uid },
          { resume: { data: req.file.buffer, contentType: req.file.mimetype } },
          { upsert: true, new: true }
      );
      res.status(200).send('Resume uploaded successfully');
  } catch (err) {
      res.status(500).send(err);
  }
});


app.post('/AddCertifications/add-certification/:uid', upload.single('certificationFile'), async (req, res) => {
  try {
    const uid = req.params.uid;
    const { name } = req.body;
    const certificationFile = req.file.buffer;

    let certification = await certificationModel.findOne({ uid });

    if (!certification) {
      certification = new certificationModel({ uid, certifications: [] });
    }

    certification.certifications.push({ name, certificationFile });

    await certification.save();

    res.status(200).send('Upload successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/AddCertifications/delete-certification/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const { certification } = req.body;

    let userCertifications = await certificationModel.findOne({ uid });

    if (!userCertifications) {
      res.status(404).send('No certifications found for this user');
    } else {
      userCertifications.certifications = userCertifications.certifications.filter(cert => cert.name !== certification);
      await userCertifications.save();
      res.status(200).send('Certification deleted successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
app.get('/AddCertifications/download-certification/:uid/:certificationName', async (req, res) => {
  try {
    const { uid, certificationName } = req.params;
    const userCertifications = await certificationModel.findOne({ uid: uid });
    const certification = userCertifications.certifications.find(cert => cert.name === certificationName);

    if (!certification) {
      return res.status(404).send('Certification not found');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + certificationName + '.pdf');
    res.send(certification.certificationFile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.post('/api/update-password', async (req, res) => {
  const { uid, password } = req.body;

  try {
      const user = await loginModel.findOne({ uid: uid });
      if (user) {
          user.password = password; // update the password
          await user.save(); // save the updated user
          res.sendStatus(200);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while updating the password');
  }
});


app.post('/api/compileAndRun', (req, res) => {
  const { uid, problemId, code, language, input } = req.body;
  compileAndRun(code, language, input)
    .then(output => res.json({ output }))
    // .catch(error => res.json({ error: `Error: ${error}` })); // Uncomment this line to handle errors
});

app.post('/api/submit', async (req, res) => {
  const { uid, problemId, problemName, code, language, testCases } = req.body; // Include language
  let status = 'Accepted';
  for (let i = 0; i < testCases.length; i++) {
    const { input, output: expectedOutput } = testCases[i];
    try {
      const output = await compileAndRun(code, language, input);
      if (output.includes('Error')) {
        status = "Compile/Runtime Error";
        break;
      }
      if(!checkOutput(output, expectedOutput)) {
        status = "Wrong Answer";
        break;
      }
    } catch (error) {
      status = 'Rejected';
      break;
    }
  }
  const submission = await codeSubmissionModel.findOne({ uid, problemId });
  if (submission) {
    submission.code.push(code);
    submission.status.push(status);
    await submission.save();
  } else {
    const newSubmission = new codeSubmissionModel({ uid, problemId, problemName, code: [code], status: [status] });
    await newSubmission.save();
  }
  if (status === 'Accepted') {
    let student = await solCountModel.findOne({ uid });
    if (student) {
      if (!student.solvedProblems.includes(problemId)) {
        student.solvedProblems.push(problemId);
        student.solvedCount += 1;
        await student.save();
      }
    } else {
      const newStudent = new solCountModel({ uid, solvedCount: status === 'Accepted' ? 1 : 0, solvedProblems: [problemId] });
      await newStudent.save();
    }  
  }
  res.json({ message: `${status}` });
});

const javaKeywords = ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'];
// const pythonKeywords = ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'];
const cppKeywords = ['alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'constinit', 'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public', 'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch', 'synchronized', 'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'];

function compileAndRun(code, language, input) { 
  let codeKeywords;
  if (language === 'java') {
    codeKeywords = javaKeywords;
    if (!codeKeywords.some(keyword => code.includes(keyword))) {
      return Promise.resolve('Invalid Code');
    }
  } else if (language === 'python') {
    codeKeywords = [];
  } else if (language === 'cpp') {
    codeKeywords = cppKeywords;
    if (!codeKeywords.some(keyword => code.includes(keyword))) {
      return Promise.resolve('Invalid Code');
    }
  }


  return new Promise((resolve, reject) => {
    const timeLimit = 5000;
    let process;
    let timer;
    let errorOutput = '';

    const cleanup = () => {
      clearTimeout(timer);
      if (process) process.kill();
    };

    const handleTimeout = () => {
      cleanup();
      resolve('TLE: Time Limit Exceeded');
    };

    if (language === 'python') {
      process = spawn('python', ['-c', code]);
      timer = setTimeout(handleTimeout, timeLimit);
      runProcess(process, input, resolve, reject);
    } else if (language === 'java') {
      fs.writeFileSync('Main.java', code);
      const compile = spawn('javac', ['Main.java']);
      compile.stderr.on('data', (data) => {
        errorOutput += data;
      });
      compile.on('close', (code) => {
        if (code !== 0) {
          cleanup();
          resolve(errorOutput);
          return;
        }
        process = spawn('java', ['Main']);
        timer = setTimeout(handleTimeout, timeLimit);
        runProcess(process, input, resolve, reject);
      });
      return;
    } else if (language === 'cpp') {
      fs.writeFileSync('main.cpp', code);
      const compile = spawn('g++', ['main.cpp', '-o', 'main']);
      compile.stderr.on('data', (data) => {
        errorOutput += data;
      });
      compile.on('close', (code) => {
        if (code !== 0) {
          cleanup();
          resolve(errorOutput);
          return;
        }
        process = spawn('./main');
        timer = setTimeout(handleTimeout, timeLimit);
        runProcess(process, input, resolve, reject);
      });
      return;
    } else {
      cleanup();
      resolve('Unsupported language');
      return;
    }
    timer = setTimeout(handleTimeout, timeLimit);
    runProcess(process, input, resolve, reject);
  });
}



// function compileAndRun(code, language, input) {
//   return new Promise((resolve, reject) => {
//     let process;
//     if (language === 'python') {
//       process = spawn('python', ['-c', code]);
//     } else if (language === 'java') {
//       fs.writeFileSync('Main.java', code);
//       const compile = spawn('javac', ['Main.java']);
//       compile.on('close', (code) => {
//         if (code !== 0) {
//           resolve('Compilation error');
//           return;
//         }
//         process = spawn('java', ['Main']);
//         runProcess(process, input, resolve, reject);
//       });
//       return;
//     } else if (language === 'cpp') {
//       fs.writeFileSync('main.cpp', code);
//       const compile = spawn('g++', ['main.cpp', '-o', 'main']);
//       compile.on('close', (code) => {
//         if (code !== 0) {
//           console.log(code);
//           resolve('Compilation error');
//           return;
//         }
//         process = spawn('./main');
//         runProcess(process, input, resolve, reject);
//       });
//       return;
//     } else {
//       resolve('Unsupported language');
//       return;
//     }
//     runProcess(process, input, resolve, reject);
//   });
// }

// function compileAndRun(code, language, input) {
//   return new Promise((resolve, reject) => {
//     let process;
//     const tempDir = os.tmpdir();
//     const tempFile = path.join(tempDir, `temp${Date.now()}`);

//     if (language === 'python') {
//       fs.writeFileSync(`${tempFile}.py`, code);
//       process = spawn('python', [`${tempFile}.py`]);
//     } else if (language === 'java') {
//       fs.writeFileSync(`${tempFile}.java`, code);
//       const compile = spawn('javac', [`${tempFile}.java`]);
//       compile.on('close', (code) => {
//         if (code !== 0) {
//           resolve('Compilation error');
//           return;
//         }
//         process = spawn('java', ['-cp', tempDir, path.basename(tempFile)]);
//         runProcess(process, input, resolve, reject);
//       });
//       return;
//     } else if (language === 'cpp') {
//       fs.writeFileSync(`${tempFile}.cpp`, code);
//       const compile = spawn('g++', [`${tempFile}.cpp`, '-o', `${tempFile}.out`]);
//       compile.on('close', (code) => {
//         if (code !== 0) {
//           resolve('Compilation error');
//           return;
//         }
//         process = spawn(`${tempFile}.out`);
//         runProcess(process, input, resolve, reject);
//       });
//       return;
//     } else if (language === 'javascript') {
//       fs.writeFileSync(`${tempFile}.js`, code);
//       process = spawn('node', [`${tempFile}.js`]);
//     } else {
//       resolve('Unsupported language');
//       return;
//     }
//     runProcess(process, input, resolve, reject);
//   });
// }

function runProcess(process, input, resolve, reject) {
  let output = '';
  let errorOutput = '';

  process.stdout.on('data', (data) => {
    output += data;
  });

  process.stderr.on('data', (data) => {
    errorOutput += data;
  });

  process.on('close', (code) => {
    if (code !== 0) {
      resolve(errorOutput ? errorOutput : 'Runtime error');
      return;
    }
    resolve(output);
  });

  if (input) {
    process.stdin.write(input, () => {
      process.stdin.end();
    });
  } else {
    process.stdin.end();
  }
}



function checkOutput(output, expectedOutput) {
  output = output.trim();
  expectedOutput = expectedOutput.trim();
  return output === expectedOutput;
}

app.get('/solvedCount/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const student = await solCountModel.findOne({ uid });
    if (student) {
      res.json({ uid: student.uid, solvedCount: student.solvedCount });
    } else {
      res.json({ uid: uid, solvedCount: 0 });
    }
  } catch (error) {
    res.json({ message: 'Server error' });
  }
});
app.get('/api/submissions', async (req, res) => {
  const { uid } = req.query;
  
  try {
    const submissions = await codeSubmissionModel.find({ uid: uid });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/get-projects/:uid', async (req, res) => {
  try {
      const projects = await stdProjectModel.findOne({ uid: req.params.uid });
      if (!projects) {
          return res.send({ message: 'No Projects' });
      }
      res.send(projects);
  } catch (err) {
      res.status(500).send({ error: 'Something went wrong' });
  }
});

app.post('/add-project/:uid', async (req, res) => {
  try {
      let project = await stdProjectModel.findOne({ uid: req.params.uid });
      if (!project) {
          project = new stdProjectModel({
              uid: req.params.uid,
              projectTitle: [req.body.projectTitle],
              projectObj: [req.body.projectObj],
              projectURL: [req.body.projectURL]
          });
      } else {
          project.projectTitle.push(req.body.projectTitle);
          project.projectObj.push(req.body.projectObj);
          project.projectURL.push(req.body.projectURL);
      }
      await project.save();
      res.send(project);
  } catch (err) {
      res.status(500).send({ error: 'Something went wrong' });
  }
});

app.delete('/delete-project/:uid', async (req, res) => {
  try {
      const { uid } = req.params;
      const { projectTitle, projectObj, projectURL } = req.body; // assuming you're sending these in the request body

      const project = await stdProjectModel.findOne({ uid: uid });
      if (!project) {
          return res.status(404).send({ message: 'No Project Found' });
      }

      const indexTitle = project.projectTitle.indexOf(projectTitle);
      const indexObj = project.projectObj.indexOf(projectObj);
      const indexURL = project.projectURL.indexOf(projectURL);

      // Ensure the project exists in all arrays before deleting
      if (indexTitle !== -1 && indexObj !== -1 && indexURL !== -1) {
          project.projectTitle.splice(indexTitle, 1);
          project.projectObj.splice(indexObj, 1);
          project.projectURL.splice(indexURL, 1);
          await project.save();
          res.send({ message: 'Project deleted' });
      } else {
          res.status(404).send({ message: 'Project not found' });
      }
  } catch (err) {
      res.status(500).send({ error: 'Something went wrong' });
  }
});


// app.use(express.static(path.join(__dirname, "./front-end/build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./front-end/build/index.html"));
// });

const uri = process.env.MONGO_DB;

try {
	mongoose.set('strictQuery', true);
	mongoose.connect(uri);
	console.log("DB Connected");
	app.listen(port, function(){
		console.log("Server running on http://localhost:"+port);
		console.log(`Server running on http://localhost:${port}`);
	});
}
catch(error){
	console.log(error);
}
