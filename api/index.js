const app = require("../backend/app");
const connectDatabase = require("../backend/config/database");

let isDbReady = false;

module.exports = async (req, res) => {
  if (!isDbReady) {
    await connectDatabase();
    isDbReady = true;
  }

  return app(req, res);
};
