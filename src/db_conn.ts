import mongoose, { ConnectOptions } from "mongoose";
import logger from "./logger.js";

const connectDb = async () => {
  try {
    logger.info(`Using ${process.env.NODE_ENV} database for connection...`);
    const baseUri = process.env.MONGO_BASE_URI;
    const dbName = process.env.MONGO_DB_NAME;
    if (baseUri && dbName) {
      const uri = baseUri + dbName;
      const options: ConnectOptions = {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        authSource: process.env.MONGO_AUTH_SOURCE,
        serverSelectionTimeoutMS: 5000,
      };
      mongoose
        .connect(uri, options)
        .then(() => logger.info("Successfully connected to MongoDB!"))
        .catch((err) => logger.error("Connection Error: ", err));
    } else {
      logger.error(
        "Connection Error: Mongo DB uri or name is undefined, please define the enviornment variables.",
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error("Unexpected Error: ", error);
    }
  }
};

export default connectDb;
