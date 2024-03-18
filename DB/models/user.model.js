// ## User Collection

// 1. firstName
// 2. lastName
// 3. username ( firstName + lastName)
// 4. email ⇒ ( unique )
// 5. password
// 6. recoveryEmail ⇒ (not unique)
// 7. DOB (date of birth, must be date format 2023-12-4)
// 8. mobileNumber ⇒ (unique)
// 9. role ⇒ (User, Company_HR )
// 10. status (online, offline)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },

    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    recoveryEmail: {
      type: String,
      required: true,
    },

    DOB: {
      type: Date,
    },

    mobileNumber: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "company_HR"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
