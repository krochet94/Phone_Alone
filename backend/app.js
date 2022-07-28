const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");

const errorMiddleware = require("./middlewares/errors");

//Setting up config file
dotenv.config({ path: path.join(__dirname, './config/config.env') });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

//Import all routes
app.use("/api/v1", require("./routes/product"));
app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1", require("./routes/order"));
app.use("/api/v1", require("./routes/payment"));

//created after building frontend
if((process.env.NODE_ENV || "").trim() === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} 

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
//C:\Users\krochet\Desktop\WebDev\Sample Projects\Phone_Alone\frontend\build