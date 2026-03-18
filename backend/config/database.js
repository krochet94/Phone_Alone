const mongoose = require("mongoose");

let isConnected = false;

const isTrue = (value) =>
  ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase());

const connectDatabase = () => {
  if (isConnected) {
    return Promise.resolve(mongoose.connection);
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

  return mongoose.connect(selectedUri).then((con) => {
    isConnected = true;
    console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    return con.connection;
  });
};

module.exports = connectDatabase;
