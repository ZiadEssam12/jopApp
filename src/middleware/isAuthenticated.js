import jwt from "jsonwebtoken";
import User from "../../DB/models/user.model.js";
const isAuthenticated = async (req, res, next) => {
  // getting the token from the request headers
  let { token } = req.headers;

  // check if the token exists
  if (!token) {
    return next(new Error("Token is missing!", 401));
  }

  // splitting the token from the bearer
  token = token.split(process.env.BEARER_KEY)[1];
  // verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // check if the token is valid
  let user = await User.findById(decoded.id);
  if (!user) {
    return next(new Error("User not found!", 404));
  }

  //     - User must be loggedIn to take any action if he wasn't throw an error
  if (user.status === "offline") {
    return next(new Error("User is not logged in!", 401));
  }

  // in case needing to use the token or decoded data
  req.token = token;
  // saving the user in the request object
  req.user = user;
  return next();
};

export default isAuthenticated;
