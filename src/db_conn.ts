import mongoose, { ConnectOptions } from "mongoose";

const connectDb = async () => {
  try {
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
        .then(() => console.log("Successfully connected to MongoDB!"))
        .catch((err) => console.error("Connection Rrror: ", err));
    } else {
      console.error(
        "Connection Error: Mongo DB uri or name is undefined, please define the enviornment variables.",
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unexpected Error: ", error);
    }
  }
};

export default connectDb;
