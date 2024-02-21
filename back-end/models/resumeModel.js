import mongoose from "mongoose";

var resumeSchema = new mongoose.Schema({
    uid: { type: String, unique: true },
    resume: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    }
});

const resumeModel = new mongoose.model("Resumes", resumeSchema);
export default resumeModel;