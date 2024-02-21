import mongoose from "mongoose";
var achieveSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  achievements: [String]
});
const achieveModel = mongoose.model("Achievements", achieveSchema);
export default achieveModel;
