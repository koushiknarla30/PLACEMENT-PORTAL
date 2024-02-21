import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  jobTitle: {
    type: String,
    required: true,
  },
  reqSkills: {type: String, required: true},
  jobCriteria: {type: String, required: true},
  cmpPackage: {type: String, required: true},
  jobDescriptionFile: {
    data: Buffer,
    contentType: String,
  }
});

const companyModel = mongoose.model("Companies", companySchema);

export default companyModel;