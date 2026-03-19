const app = require("../backend/app");
const connectDatabase = require("../backend/config/database");
const { getConnectionState } = connectDatabase;

let isDbReady = false;

const isHealthRequest = (req) => {
  const rawUrl = req && typeof req.url === "string" ? req.url : "";
  const path = rawUrl.split("?")[0];
  return path === "/api/health";
};

const sendServiceUnavailable = (res, error) => {
  const payload = {
    success: false,
    message: "Database connection unavailable.",
    error: error instanceof Error ? error.message : String(error),
    db: getConnectionState(),
  };

  res.statusCode = 503;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

module.exports = async (req, res) => {
  if (isHealthRequest(req)) {
    return app(req, res);
  }

  if (!isDbReady) {
    try {
      await connectDatabase();
      isDbReady = true;
    } catch (error) {
      isDbReady = false;
      return sendServiceUnavailable(res, error);
    }
  }

  return app(req, res);
};
