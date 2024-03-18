import isAuthenticated from "../../middleware/isAuthenticated.js";
import isAuthorized from "../../middleware/isAuthorized.js";
import validation from "../../middleware/validation.middleware.js";
import * as companyController from "./company.controller.js";
import * as companySchema from "./company.schema.js";
import { Router } from "express";

const router = Router();
// ----------------------------------------------------------------------------------------- //
// 1. Add company
router.post(
  "/addCompany",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(companySchema.addCompanySchema),
  companyController.addCompany
);

// ----------------------------------------------------------------------------------------- //
// 2. search by name
router.get(
  "/SearchByName",
  isAuthenticated,
  isAuthorized("Company_HR", "user"),
  companyController.SearchByName
);

// ----------------------------------------------------------------------------------------- //
// 3. delete company
router.delete(
  "/deleteCompany/:companyId",
  isAuthenticated,
  isAuthorized("Company_HR"),
  companyController.deleteCompany
);

// ----------------------------------------------------------------------------------------- //
// 4. get company data
router.get(
  "/getCompany/:companyId",
  isAuthenticated,
  isAuthorized("Company_HR"),
  companyController.getCompany
);

// ----------------------------------------------------------------------------------------- //
// 5. get all jobs for a specific company
router.get(
  "/:jobId",
  isAuthenticated,
  isAuthorized("Company_HR"),
  companyController.getAllApplicationsForSpecificJob
);

// ----------------------------------------------------------------------------------------- //
// 6. update company
router.patch(
  "/:companyId",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(companySchema.updateCompanySchema),
  companyController.updateCompany
);

export default router;
