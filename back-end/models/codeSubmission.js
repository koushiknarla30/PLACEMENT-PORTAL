import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  uid: String,
  problemId: Number,
  problemName: String,
  code: [{ type: String }],
  status: [{ type: String }],
});

const codeSubmissionModel = new mongoose.model("submissions", submissionSchema);

export default codeSubmissionModel;