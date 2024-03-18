import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./DB/db_connection.js";
import userRouter from "./src/modules/user/user.router.js";
import companyRouter from "./src/modules/company/company.router.js";
import jobRouter from "./src/modules/job/job.router.js";
// usign dotenv to load environment variables
dotenv.config();

// ----------------------------------------------------------------------------------------- //
// init express server
const app = express();
const port = 3000;

// ----------------------------------------------------------------------------------------- //
// using cors and json middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------------------------- //
// init the routes
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);
// ----------------------------------------------------------------------------------------- //
// if the request is not handled by any of the above routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server !`,
  });
});

// ----------------------------------------------------------------------------------------- //
// global error handler
app.use((err, req, res, next) => {
  if (err.message.includes("duplicate key error")) {
    err.message =
      err.message.split("{").splice(1).join("{").split("}")[0] +
      "already exists";
  }
  return res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message,
    stack: err.stack,
  });
});

// ----------------------------------------------------------------------------------------- //
//starting the server
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await connection();
});
