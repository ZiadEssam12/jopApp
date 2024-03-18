// mongoose db connection

import mongoose from "mongoose";

const connection = async () => {
  await mongoose.connect(process.env.DB_URL).then(() => {
    console.log("MongoDB Connected");
  });
};

export default connection;
