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

server.on("error", (err) => {
  const code =
    typeof err === "object" && err !== null && "code" in err ? err.code : undefined;

  if (code === "EADDRINUSE") {
    console.error(`ERROR: Port ${port} is already in use.`);
    console.error(
      "Tip: stop the existing process using this port, or set a different PORT in backend/config/config.env."
    );
    process.exit(1);
  }

  const message = err instanceof Error ? err.message : String(err);
  console.error(`ERROR: ${message}`);
  process.exit(1);
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.log(`ERROR: ${message}`);
  console.error("Server shutting down due to Unhandled Promise Rejection");
  server.close(() => process.exit(1));
});
