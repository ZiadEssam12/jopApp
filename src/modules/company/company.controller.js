import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
// # Company APIs

// ----------------------------------------------------------------------------------------- //
// 1. Add company
//     - apply authorization with role ( Company_HR )

//     - check if the number of employees is in the correct format (min-max)
//     - get the logged in user id from the request object
//     - add the user id to the company data
//     - create the company
//     - send the response

export const addCompany = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const range = data.numberOfEmployees.split("-");
  if (range[0] > range[1]) {
    return next(new Error("Invalid number of employees", 400));
  }
  data.companyHR = req.user._id;
  const company = await Company.create(data);
  return res.status(200).json({
    success: true,
    message: "Company Added Successfully",
    result: company,
  });
});

// ----------------------------------------------------------------------------------------- //
// 2. Update company data
//     - only the company owner can update the data
//     - apply authorization with role ( Company_HR)

//     - get the company id from the request params
//     - get the company data from the database
//     - check if the company exists
//     - check if the logged in user is the company owner
//     - update the company data
//     - send the response
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const data = req.body;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("Company Not Found", 404));
  }
  if (company.companyHR.toString() !== req.user._id.toString()) {
    return next(new Error("Unauthorized to update this company", 401));
  }

  // Update the properties of the company object
  Object.assign(company, data);

  // Save the company object
  const result = await company.save();

  return res.status(200).json({
    success: true,
    message: "Company Updated Successfully",
    result,
  });
});
// ----------------------------------------------------------------------------------------- //
// 3. Delete company data
//     - only the company owner can delete the data
//     - apply authorization with role ( Company_HR)

//     - get the company id from the request params
//     - get the company data from the database
//     - check if the company exists
//     - check if the logged in user is the company owner
//     - delete the company data
//     - send the response
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("Company Not Found", 404));
  }
  if (company.companyHR.toString() !== req.user._id.toString()) {
    return next(new Error("Unauthorized to delete this company", 401));
  }
  await company.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Company Deleted Successfully",
  });
});
// ----------------------------------------------------------------------------------------- //
// 4. Get company data
//     - send the companyId in params to get the desired company data
//     - return all jobs related to this company
//     - apply authorization with role ( Company_HR)

//     - get the company id from the request params
//     - get the company data from the database
//     - check if the company exists
//     - get all jobs for this company
//     - send the response
export const getCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("Company Not Found", 404));
  }
  const jobs = await Job.find({ addedBy: company.companyHR });

  // Convert the Mongoose object to a plain JavaScript object
  const companyObject = company.toObject();

  // Add the jobs to the company object
  companyObject.jobs = jobs;

  return res.status(200).json({
    success: true,
    message: "Company Found Successfully",
    result: companyObject,
  });
});

// ----------------------------------------------------------------------------------------- //
// 5. Search for a company with a name.
//     - apply authorization with the role ( Company_HR and User)

//     - get company name from the request query
//     - search for the company in the database
//     - return the company data
export const SearchByName = asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  const company = await Company.find({
    companyName: { $regex: name, $options: "i" },
  });
  return res.status(200).json({
    success: true,
    message: "Company Found Successfully",
    result: company,
  });
});
// ----------------------------------------------------------------------------------------- //
// 6. Get all applications for specific Jobs
//     - each company Owner can take a look at the applications for his jobs only, he has no access to other companies’ application
//     - return each application with the user data, not the userId
//     - apply authorization with role (  Company_HR )

//     - get the jobId from the request params
//     - get the job data from the database
//     - check if the job exists
//     - check if the logged in user is the job owner
//     - get all applications for this job
//     - send the response
export const getAllApplicationsForSpecificJob = asyncHandler(
  async (req, res, next) => {
    const id = req.user._id;
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new Error("Job Not Found", 404));
    }
    if (job.addedBy.toString() !== id.toString()) {
      return next(new Error("Unauthorized to get this job", 401));
    }
    const applications = await Application.find({ jobId }).populate(
      "userId",
      "-password"
    );
    return res.status(200).json({
      success: true,
      result: applications,
    });
  }
);
