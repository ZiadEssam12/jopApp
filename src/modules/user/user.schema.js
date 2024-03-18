import joi from "joi";

export const signUpSchema = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    DOB: joi.date().less("now").required(),
    mobileNumber: joi
      .string()
      .pattern(/^01[0-2,5]\d{8}$/)
      .required(),
    confirmPassword: joi.string().min(8).valid(joi.ref("password")).required(),
    recoveryEmail: joi.string().email().required(),
  })
  .required();

export const signInSchema = joi
  .object({
    email: joi.string().email(),
    password: joi.string().min(8).required(),
    mobileNumber: joi.string().pattern(/^01[0-2,5]\d{8}$/),
  })
  .required();

//   3. update account.
//   - you can update ( email , mobileNumber , recoveryEmail , DOB , lastName , firstName)
//   - if user update the email , mobileNumber make sure that the new data doesn’t conflict with any existing data in your  database
//   - User must be loggedIn
//   - only the owner of the account can update his account data
export const updateUserSchema = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
    recoveryEmail: joi.string().email(),
    DOB: joi.date(),
    mobileNumber: joi.string().pattern(/^01[0-2,5]\d{8}$/),
  })
  .required();

export const updatePassword = joi
  .object({
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();

export const getAccountsByRecoveryEmail = joi
  .object({
    recoveryEmail: joi.string().email().required(),
  })
  .required();

export const resetPassword = joi
  .object({
    identification: joi.string().required(),
    code: joi.string().required(),
    newPassword: joi.string().min(8).required(),
  })
  .required();

export const sendOTP = joi
  .object({
    identification: joi.string().required(),
  })
  .required();
