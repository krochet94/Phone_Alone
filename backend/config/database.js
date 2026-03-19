const mongoose = require("mongoose");

let isConnected = false;
let connectionPromise = null;

const isTrue = (value) =>
  ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase());

const parsePositiveInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getConnectionState = () => {
  const readyState = mongoose.connection.readyState;
  return {
    readyState,
    isConnected: isConnected && readyState === 1,
  };
};

const isDatabaseConnected = () => getConnectionState().isConnected;

const connectDatabase = () => {
  if (isDatabaseConnected()) {
    return Promise.resolve(mongoose.connection);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const isProduction =
    (process.env.NODE_ENV || "development").toLowerCase() === "production";
  const useAtlas = isProduction || isTrue(process.env.USE_ATLAS);

  const atlasUri = process.env.DB_URI;
  const localUri = process.env.DB_LOCAL_URI;

  const selectedUri = useAtlas ? atlasUri : localUri || atlasUri;

  if (!selectedUri) {
    throw new Error("No database URI configured. Set DB_LOCAL_URI and/or DB_URI.");
  }

  const sourceLabel = useAtlas || !localUri ? "DB_URI (Atlas)" : "DB_LOCAL_URI (Local)";
  console.log(`Connecting to MongoDB using ${sourceLabel}...`);

  const connectionOptions = {
    serverSelectionTimeoutMS: parsePositiveInt(
      process.env.DB_SERVER_SELECTION_TIMEOUT_MS,
      5000
    ),
    connectTimeoutMS: parsePositiveInt(process.env.DB_CONNECT_TIMEOUT_MS, 5000),
    socketTimeoutMS: parsePositiveInt(process.env.DB_SOCKET_TIMEOUT_MS, 45000),
  };

  connectionPromise = mongoose
    .connect(selectedUri, connectionOptions)
    .then((con) => {
      isConnected = true;
      console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
      return con.connection;
    })
    .catch((error) => {
      isConnected = false;
      throw error;
    })
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
};

module.exports = connectDatabase;
module.exports.isDatabaseConnected = isDatabaseConnected;
module.exports.getConnectionState = getConnectionState;
