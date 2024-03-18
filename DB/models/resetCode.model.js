import mongoose from "mongoose";

const resetCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ResetCode = mongoose.model("ResetCode", resetCodeSchema);
export default ResetCode;
