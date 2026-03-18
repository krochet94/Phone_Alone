const path = require("path");
const dotenv = require("dotenv");

let isLoaded = false;

const loadEnv = () => {
  if (isLoaded) return;

  const isProduction =
    (process.env.NODE_ENV || "development").toLowerCase() === "production";

  if (!isProduction) {
    dotenv.config({ path: path.join(__dirname, "config.env") });
  }

  isLoaded = true;
};

module.exports = loadEnv;
