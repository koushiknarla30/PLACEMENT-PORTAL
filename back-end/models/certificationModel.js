import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    certificationFile: {
      type: Buffer,
      required: true
    }
  });  

const certificationSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  certifications: [CertificationSchema]
});

const certificationModel = mongoose.model('Certifications', certificationSchema);
export default certificationModel;
