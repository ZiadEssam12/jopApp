import Joi from "joi";
import { validateID } from "../../middleware/validation.middleware.js";

export const addjobSchema = Joi.object({
  jobTitle: Joi.string().required(),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").required(),
  workingTime: Joi.string().valid("part-time", "full-time").required(),
  seniorityLevel: Joi.string()
    .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
    .required(),
  jobDescription: Joi.string().required(),
  technicalSkills: Joi.array().items(Joi.string()).required(),
  softSkills: Joi.array().items(Joi.string()).required(),
});
export const updatejobSchema = Joi.object({
  jobTitle: Joi.string().required(),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
  workingTime: Joi.string().valid("part-time", "full-time"),
  seniorityLevel: Joi.string().valid(
    "Junior",
    "Mid-Level",
    "Senior",
    "Team-Lead",
    "CTO"
  ),
  jobDescription: Joi.string(),
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
});

export const applyJobSchema = Joi.object({
  userTechSkills: Joi.array().min(1).items(Joi.string()).required(),
  userSoftSkills: Joi.array().min(1).items(Joi.string()).required(),
});
