import Joi from "joi";
import { validateID } from "../../middleware/validation.middleware.js";

export const addCompanySchema = Joi.object({
  companyName: Joi.string().required(),
  description: Joi.string().required(),
  industry: Joi.string().required(),
  address: Joi.string().required(),
  numberOfEmployees: Joi.string()
    .pattern(/^\d+-\d+$/)
    .required(),
  companyEmail: Joi.string().email().required(),
});

export const updateCompanySchema = Joi.object({
  companyName: Joi.string(),
  description: Joi.string(),
  industry: Joi.string(),
  address: Joi.string(),
  numberOfEmployees: Joi.string()
    .pattern(/^\d+-\d+$/)
    .required(),
  companyEmail: Joi.string().email(),
  companyHR: Joi.string().custom(validateID),
});
