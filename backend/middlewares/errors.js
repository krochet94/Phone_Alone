const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  const env = String(process.env.NODE_ENV || "development")
    .trim()
    .toLowerCase();

  if (env === "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    let error = { ...err };
    error.message = err.message;

    //Wrong mongoose object ID error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    //Handling Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    //Handling Mongoose duplicate key errors
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    //Handling Wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = 'Invalid JSON Web Token. Please try again.';
      error = new ErrorHandler(message, 400);
    }

     //Handling Wrong JWT error
     if (err.name === "TokenExpiredError") {
      const message = 'Expired JSON Web Token. Please try again.';
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
