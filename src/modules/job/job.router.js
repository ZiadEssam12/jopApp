import { Router } from "express";
import * as jobController from "./job.controller.js";
import * as jobSchema from "./job.schema.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";
import isAuthorized from "../../middleware/isAuthorized.js";
import validation from "../../middleware/validation.middleware.js";
import fileUpload from "../../utils/cloudUpload.js";
const router = Router();
// # Jobs APIs

// ----------------------------------------------------------------------------------------- //
// 1. Add Job

router.post(
  "/addJob",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(jobSchema.addjobSchema),
  jobController.addJob
);

// ----------------------------------------------------------------------------------------- //
// 2. Update Job
router.patch(
  "/updateJob/:jobId",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(jobSchema.updatejobSchema),
  jobController.updateJob
);

// ----------------------------------------------------------------------------------------- //
// 3. Delete Job
router.delete(
  "/deleteJob/:jobId",
  isAuthenticated,
  isAuthorized("Company_HR"),
  jobController.deleteJob
);

// ----------------------------------------------------------------------------------------- //
// 4. Get All Jobs
router.get(
  "/getAll",
  isAuthenticated,
  isAuthorized("user", "Company_HR"),
  jobController.getAllJobsWithCompanyInformation
);

// ----------------------------------------------------------------------------------------- //
// 5. apply for a job
router.post(
  "/apply/:jobId",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload().single("cv"),
  validation(jobSchema.applyJobSchema),
  jobController.applyForJob
);

// ----------------------------------------------------------------------------------------- //
// 6. Get all Jobs for a specific company.
router.get(
  "/getJobsForCompany",
  isAuthenticated,
  isAuthorized("user", "Company_HR"),
  jobController.getAllJobsForSpecificCompany
);

// ----------------------------------------------------------------------------------------- //
// 7. Get jobs by filter
router.get(
  "/getJobsWithFilters",
  isAuthenticated,
  isAuthorized("user", "Company_HR"),
  jobController.getJobsWithFilters
);
export default router;
