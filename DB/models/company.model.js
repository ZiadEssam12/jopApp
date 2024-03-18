// ## Company Collection

// 1. companyName ⇒ ( unique )
// 2. description (Like what are the actual activities and services provided by the company ? )
// 3. industry ( Like Mental Health care )
// 4. address
// 5. numberOfEmployees ( must be range such as 11-20 employee)
// 6. companyEmail ⇒ ( unique )
// 7. companyHR ( userId )

import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
  },

  industry: {
    type: String,
  },

  address: {
    type: String,
  },

  numberOfEmployees: {
    type: String,
  },

  companyEmail: {
    type: String,
    required: true,
    unique: true,
  },

  companyHR: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Company = mongoose.model("Company", companySchema);
export default Company;

