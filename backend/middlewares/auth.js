const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

//Checks if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to have an access.", 401));
  }

  const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
  req.user = await User.findById(decoded.id);

  next();
});

//Handling users roles
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Warning! (${req.user.role}) unauthorized access.`,
          403
        )
      );
    }
    next();
  };
};
