import mongoose from "mongoose";
var SkillSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  skills: [String]
});
const skillModel = mongoose.model("StudentSkill", SkillSchema);
export default skillModel;
