const mongoose = require("mongoose");

const OfficerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nagarId : { type : String } ,
    department : { type : String } ,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["main", "sub"], default: "sub" },
    status : { type: String , enum: ["active", "inactive","busy"] , default : "inactive" },
    assignedReports : [ { type : mongoose.Schema.Types.ObjectId , ref : "Report"}]
  },
  { timestamps: true }
);


const Officer = mongoose.model("Officer", OfficerSchema);

module.exports = Officer;
