const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const loadEnv = require("./config/loadEnv");

const errorMiddleware = require("./middlewares/errors");

loadEnv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.set("trust proxy", 1);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

//Import all routes
app.use("/api/v1", require("./routes/product"));
app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1", require("./routes/order"));
app.use("/api/v1", require("./routes/payment"));

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;