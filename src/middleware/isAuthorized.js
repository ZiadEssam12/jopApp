const isAuthorized =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You are not authorized!", 403));
    }
    return next();
  };

export default isAuthorized;
