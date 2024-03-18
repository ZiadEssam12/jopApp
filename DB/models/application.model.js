// ## A**pplication** Collection

// 1. jobId ( the Job Id )
// 2. userId ( the applier Id )
// 3. userTechSkills ( array of the applier technical Skills )
// 4. userSoftSkills ( array of the applier soft Skills )
// 5. userResume ( must be pdf , upload this pdf on cloudinary )

import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userTechSkills: {
    type: Array,
  },
  userSoftSkills: {
    type: Array,
  },
  userResume: {
    url: {
      type: String,
    },
    id: {
      type: String,
    },
  },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
