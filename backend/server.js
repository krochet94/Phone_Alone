const app = require("./app");
const connectDatabase = require("./config/database");

const loadEnv = require("./config/loadEnv");

//Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Server shutting down due to uncaught exception");
  process.exit(1);
});

loadEnv();

//Connecting to database
connectDatabase();

const port = Number(process.env.PORT) || 4000;

const server = app.listen(port, () => {
  console.log(
    `Server started on PORT: ${port} in ${(process.env.NODE_ENV || "development").toLowerCase()} mode.`
  );
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.error("Server shutting down due to Unhandled Promise Rejection");
  server.close(() => process.exit(1));
});
