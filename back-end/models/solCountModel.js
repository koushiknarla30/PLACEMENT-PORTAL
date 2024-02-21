import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    uid: {type: String, unique: true},
    solvedCount: Number,
    solvedProblems: [Number]
});

const solCountModel = new mongoose.model("SolvedCount", studentSchema);

export default solCountModel;