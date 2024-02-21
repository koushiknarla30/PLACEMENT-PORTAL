import mongoose from "mongoose";

var stdDetailsSchema = new mongoose.Schema( {
    uid: {type: String, unique: true},
    name: String,
    branch: String,
    btechPer: String,
    actBacklogs: Number,
    pasBacklogs: Number,
    tenthPer: String,
    intDipPer: String,
    eamRank: Number,
    proImage: {
        data: Buffer,
        contentType: String,
    }
});

const stdDetailsModel = mongoose.model("StudentDetails", stdDetailsSchema);
export default stdDetailsModel;
