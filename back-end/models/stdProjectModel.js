import mongoose from "mongoose";

var stdProjectSchema = new mongoose.Schema({
    uid: {type: String, unique: true},
    projectTitle: [String],
    projectObj: [String],
    projectURL: [String]
});

const stdProjectModel = new mongoose.model("StudentProjects", stdProjectSchema);

export default stdProjectModel;