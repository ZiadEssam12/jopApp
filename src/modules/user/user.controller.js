import User from "../../../DB/models/user.model.js";
import asyncHandler from "../../../src/utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Randomstring from "randomstring";
import ResetCode from "../../../DB/models/resetCode.model.js";
import sendingEmail from "../../utils/sendingEmail.js";
// # User APIs

// ----------------------------------------------------------------------------------------- //

// 1. Sign Up
// 1) gettign the data from the request body
// 2) validate the data                     --> validation
// 3) check if the user already exists
// 4) if not, hash the password
// 5) create the user
// 6) send the response
// 7) catch any errors
export const signup = asyncHandler(async (req, res, next) => {
  // getting the validated data from the request body
  let data = req.body;

  /// check if the user already exists
  await User.findOne({ email: data.email }).then((user) => {
    if (user) {
      return next(new Error("User already exists", 409));
    }
  });
  const hashedPassword = bcrypt.hashSync(
    data.password,
    Number(process.env.SALT_ROUNDS)
  );

  // add userName to the data
  data = {
    ...data,
    password: hashedPassword,
    userName: `${data.firstName}_${data.lastName}`,
  };

  // create the user
  await User.create(data);

  // send the response
  return res.status(201).json({ success: true, message: "User created" });
});
// ----------------------------------------------------------------------------------------- //

// 2. Sign In
// 1) gettign the data from the request body
// 2) validate the data                     --> validation
// 3) check if the user exists              --> validation
// 4) if is check the password
// 5) send the response
// 6) catch any errors
// 7) create the token
//
// 2. Sign In
//     - Sign In using  (email or mobileNumber)  and password
//     - don’t forget to update the status to online after SignIn
//
export const signin = asyncHandler(async (req, res, next) => {
  // getting the validated data from the request body
  const { email, password, mobileNumber } = req.body;
  let user;

  // check if the user entered an email or a mobile number
  if (!email && !mobileNumber) {
    return next(new Error("Please enter email or mobile number", 400));
  }

  // get users data from the database
  if (email) {
    user = await User.findOne({ email });
  } else if (mobileNumber) {
    user = await User.findOne({ mobileNumber });
  }
  // check if the user exists
  if (!user) {
    return next(new Error("User not found", 404));
  }
  // check the password
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new Error("Wrong password", 401));
  }

  //creating the token
  let token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET
  );
  token = process.env.BEARER_KEY + token;

  // update the user status to online
  user.status = "online";
  await user.save();
  // send the response
  return res
    .status(200)
    .json({ success: true, message: "User logged in", token });
});

// ----------------------------------------------------------------------------------------- //
// 3. update account.
//     - you can update ( email , mobileNumber , recoveryEmail , DOB , lastName , firstName)
//     - if user update the email , mobileNumber make sure that the new data doesn’t conflict with any existing data in your database
//     - User must be loggedIn
//     - only the owner of the account can update his account data
//     - don’t forget to validate the data
//     - send the response
//     - catch any errors
export const updateAccount = asyncHandler(async (req, res, next) => {
  // getting the validated data from the request body
  const data = req.body;
  // getting the user from the request object
  const user = req.user;

  // check if the user entered an email or a mobile number make the user offline if he changed his email or mobile number
  if (data.email) {
    // making the user offline so he must log in again to get a valid token
    data.status = "offline";
  }

  // update the user
  await User.findByIdAndUpdate(user._id, data);

  // send the response
  return res.status(200).json({ success: true, message: "User updated" });
});
// ----------------------------------------------------------------------------------------- //
// 4. Delete account
//     - only the owner of the account can delete his account data

//     - User must be loggedIn
//     - get the id from req.user
//     - delete the Account from the database
//     - send the response
export const deleteAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  return res.json({ success: true, message: "User was deleted successfully" });
});
// ----------------------------------------------------------------------------------------- //
// 5. Get user account data
//     - only the owner of the account can get his account data
//     - User must be loggedIn

//     - get the information from the user object in the req from the validation step
//     - send the response
export const getLoggedInUserData = asyncHandler(async (req, res, next) => {
  const userObject = req.user.toObject();
  delete userObject.password;
  return res.status(200).json({ success: true, result: userObject });
});
// ----------------------------------------------------------------------------------------- //
// 6. Get profile data for another user
//     - send the userId in params or query

//     - User must be loggedIn
//     - get the id from the params
//     - check if An ID was sent
//     - get the user data from the database
//     - send the response
export const getAnotherUserProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(
      new Error("An id of the other user is required", { cause: 404 })
    );
  }
  return res.status(200).json({
    success: true,
    result: await User.findById(id).select("-password"),
  });
});
// ----------------------------------------------------------------------------------------- //
// 7. Update password

//     - User must be loggedIn
//     - only the owner of the account can update his account data
//     - upadate the password of the current logged in user from the user object in the req from the validation step
export const updatePassword = asyncHandler(async (req, res, next) => {
  let { newPassword } = req.body;
  newPassword = bcrypt.hashSync(newPassword, Number(process.env.SALT_ROUNDS));

  // updating user password form the user object in the req from the validation step
  req.user.password = newPassword;
  await req.user.save();
  return res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
});
// ----------------------------------------------------------------------------------------- //
// 8. Forget password ( without sending any email , make sure of your data security specially the OTP and the newPassword )
//    - User must enter his email or mobile number
//    - Find the user in the database
//    - OTP will be saved in the database
//    - return the OTP to the user

//    - User must enter his email or mobile number
//    - search for the user in the database
//    - if the user is found, we will delete any old reset code
//    - we will create a new reset code
//    - we will save the reset code in the database
//    - we will send an email with reset code to the user
//    - we will send the response
export const sendOTP = asyncHandler(async (req, res, next) => {
  const { identification } = req.body;

  const resetCode = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  const query = {
    $or: [{ email: identification }, { mobileNumber: identification }],
  };
  const user = await User.findOne(query);

  if (!user) {
    return next(new Error("User not found", 404));
  }

  // if the user has an old reset code, we will update it with the new one
  await ResetCode.findOneAndDelete({ userId: user._id });

  // if the user doesn't have an old reset code, we will create a new one
  // saving the reset code in the database
  await ResetCode.create({ userId: user._id, code: resetCode });

  sendingEmail({
    to: user.email,
    subject: "Reset Password",
    text: `Your OTP is ${resetCode}`,
  });

  return res.json({
    success: true,
    message: `An OTP was send to Your Mailbox`,
  });
});

//   - User must enter his email or mobile number
//   - User must enter the OTP
//   - User must enter the newPassword
//   - Find the user in the database
//   - Find the OTP in the database
//   - update the user password
//   - delete the OTP from the database
//   - send the response
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { identification, code, newPassword } = req.body;

  const query = {
    $or: [{ email: identification }, { mobileNumber: identification }],
  };

  const user = await User.findOne(query);
  if (!user) {
    return next(new Error("User not found", 404));
  }

  // check if the code is correct
  const resetCode = await ResetCode.findOne({ userId: user._id, code });

  if (
    !resetCode ||
    (resetCode.code !== code && resetCode.userId !== user._id)
  ) {
    return next(new Error("Wrong code", 401));
  }
  // updating the password
  user.password = bcrypt.hashSync(newPassword, Number(process.env.SALT_ROUNDS));
  await user.save();

  // deleting the reset code
  await resetCode.deleteOne();

  return res
    .status(200)
    .json({ success: true, message: `Password reset successfully` });
});
// ----------------------------------------------------------------------------------------- //
// 9. Get all accounts associated to a specific recovery Email

//    - User must enter the recoveryEmail
//    - Find the user in the database
//    - return all accounts associated to this recoveryEmail
//    - return the response
export const getAccountsByRecoveryEmail = asyncHandler(
  async (req, res, next) => {
    const { recoveryEmail } = req.body;
    if (!recoveryEmail) {
      return next(new Error("Recovery email is missing", 400));
    }
    const users = await User.find({ recoveryEmail }).select("-password");
    return res.json({ success: true, result: users });
  }
);
