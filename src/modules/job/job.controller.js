// # Jobs APIs

import applicationModel from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

// ----------------------------------------------------------------------------------------- //
// 1. Add Job
//     - apply authentication
//     - apply authorization with the role ( Company_HR )
//     - apply validation on the request body
//     - getting the data from the request body
//     - add the job to the DB
//     - return success message
export const addJob = asyncHandler(async (req, res, next) => {
  // getting the vlideated data from the request
  const data = req.body;
  // getting the user from the request
  const { _id } = req.user;

  await Job.create({ ...data, addedBy: _id });
  return res
    .status(201)
    .json({ success: true, message: "Job added successfully" });
});
// ----------------------------------------------------------------------------------------- //
// 2. Update Job
//     - apply authorization with the role ( Company_HR )
//     - apply validation on the request body
//     - getting the data from the request body
//     - update the job in the DB
//     - return success message
export const updateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { _id } = req.user;
  const data = req.body;

  await Job.findByIdAndUpdate(jobId, { ...data, addedBy: _id }).then((job) => {
    if (!job) {
      return next(new ErrorResponse("Job not found", 404));
    }
  });
  return res
    .status(200)
    .json({ success: true, message: "Job updated successfully" });
});
// ----------------------------------------------------------------------------------------- //
// 3. Delete Job
//     - apply authorization with the role ( Company_HR )
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  await Job.findByIdAndDelete(jobId).then((job) => {
    if (!job) {
      return next(new ErrorResponse("Job not found", 404));
    }
  });
  return res
    .status(200)
    .json({ success: true, message: "Job deleted successfully" });
});
// ----------------------------------------------------------------------------------------- //
// 4. Get all Jobs with their company’s information.
//     - apply authorization with the role ( User , Company_HR )
//     - apply authentication
//     - apply authorization with the role ( User , Company_HR )
//     - getting all jobs from the DB
//     - return all jobs

//     - TO DO find a better way to get the company information
export const getAllJobsWithCompanyInformation = asyncHandler(
  async (req, res, next) => {
    let jobs = await Job.find();
    jobs = await Promise.all(
      jobs.map(async (job) => {
        const company = await Company.findOne({ companyHR: job.addedBy });
        job = job.toObject(); // Convert the Mongoose document to a plain JavaScript object
        job.company = company;
        return job;
      })
    );

    return res.status(200).json({ success: true, result: jobs });
  }
);
// ----------------------------------------------------------------------------------------- //
// 5. Get all Jobs for a specific company.
//     - apply authorization with the role ( User , Company_HR )
//     - send the company name in the query and get this company jobs.
export const getAllJobsForSpecificCompany = asyncHandler(
  async (req, res, next) => {
    const { companyName } = req.query;
    const company = await Company.findOne({ companyName });
    if (!company) {
      return next(new Error("Company not found", 404));
    }
    const jobs = await Job.find({ addedBy: company.companyHR });
    return res.status(200).json({ success: true, result: jobs });
  }
);

// ----------------------------------------------------------------------------------------- //
// 6. Get all Jobs that match the following filters
//     - allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
//     - one or more of them should applied
//     **Exmaple** : if the user selects the
//     **workingTime** is **part-time** and the **jobLocation** is **onsite**
//     , we need to return all jobs that match these conditions
//     - apply authorization with the role ( User , Company_HR )

//     - getting the data from the request query
//     - getting all jobs from the DB
//     - return all jobs that match the filters
//     - return the response with the status code 200
export const getJobsWithFilters = asyncHandler(async (req, res, next) => {
  const { workingTime, jobLocation, seniorityLevel, jobTitle } = req.query;
  const query = {};
  if (workingTime) query.workingTime = workingTime;
  if (jobLocation) query.jobLocation = jobLocation;
  if (seniorityLevel) query.seniorityLevel = seniorityLevel;
  if (jobTitle) query.jobTitle = jobTitle;
  const jobs = await Job.find(query);
  return res.status(200).json({ success: true, result: jobs });
});
// ----------------------------------------------------------------------------------------- //
// 7. Apply to Job
//     - This API will add a new document in the application Collections with the new data
//     - apply authorization with the role ( User )

//     - getting the data from the request body
//     - getting the user from the request
//     - Search for the job in the DB
//     - if the job not found return error message
//     - create a new document in the application collection
//     - return success message
export const applyForJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { _id } = req.user;

  await Job.findById(jobId).then((job) => {
    if (!job) {
      return next(new Error("Job not found", 404));
    }
  });
  if (!req.file) {
    return next(new Error("A CV must be attached", 400));
  }

  // upload the PDF to cloudinary and save the url in the DB
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `applications/resume`,
    }
  );

  await applicationModel.create({
    ...req.body,
    jobId: jobId,
    userId: _id,
    userResume: { url: secure_url, id: public_id },
  });
  return res
    .status(201)
    .json({ success: true, message: "Applied successfully" });
});
