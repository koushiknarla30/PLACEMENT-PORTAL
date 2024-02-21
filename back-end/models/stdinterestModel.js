import mongoose from "mongoose";

var stdinterestSchema = new mongoose.Schema({
  companyName: { type: String, unique: true },
  students: [{ studentId: String, status: String }],
});

const stdinterestModel = mongoose.model("StudentInterests", stdinterestSchema);
export default stdinterestModel;
