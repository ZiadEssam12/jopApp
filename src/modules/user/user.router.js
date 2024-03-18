import { Router } from "express";
import * as userController from "./user.controller.js";
import * as userSchema from "./user.schema.js";
import validation from "../../middleware/validation.middleware.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";
// ----------------------------------------------------------------------------------------- //
// init express router
const router = Router();

// ----------------------------------------------------------------------------------------- //
// # User APIs
// 1. Sign up
router.post(
  "/signup",
  validation(userSchema.signUpSchema),
  userController.signup
);

// ----------------------------------------------------------------------------------------- //
// 2. Sign in
router.post(
  "/signin",
  validation(userSchema.signInSchema),
  userController.signin
);

// ----------------------------------------------------------------------------------------- //
// 3. Update Account
router.patch(
  "/update",
  isAuthenticated,
  validation(userSchema.updateUserSchema),
  userController.updateAccount
);

// ----------------------------------------------------------------------------------------- //
// 4- delete account
router.delete("/delete", isAuthenticated, userController.deleteAccount);

// ----------------------------------------------------------------------------------------- //
// 5. Get Logged In User Data

router.get(
  "/getLoggedInUserData",
  isAuthenticated,
  userController.getLoggedInUserData
);

// ----------------------------------------------------------------------------------------- //
// 6. Get Another User Profile
router.get(
  "/getAnotherUserProfile/:id",
  isAuthenticated,
  userController.getAnotherUserProfile
);

// ----------------------------------------------------------------------------------------- //
// 7. update password
router.patch(
  "/updatePassword",
  isAuthenticated,
  validation(userSchema.updatePassword),
  userController.updatePassword
);

// ----------------------------------------------------------------------------------------- //
// 8. send OTP
router.post("/sendOTP", validation(userSchema.sendOTP), userController.sendOTP);

// ----------------------------------------------------------------------------------------- //
// 9. verify OTP and reset password
router.patch(
  "/resetPassword",
  validation(userSchema.resetPassword),
  userController.resetPassword
);

// ----------------------------------------------------------------------------------------- //
// 10. get accounts by recovery email
router.get(
  "/getAccountsByRecoveryEmail",
  validation(userSchema.getAccountsByRecoveryEmail),
  userController.getAccountsByRecoveryEmail
);

export default router;
