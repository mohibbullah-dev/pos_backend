import mongoose from "mongoose";
import { MONGO_DB_URL } from "../constant.js";

const MONGODB_CONNECTION = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_DB_URL);
    console.log(
      "mongodb connected !! DB Host",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MONGO DB Connection failed", error);
    process.exit(1);
  }
};

export { MONGODB_CONNECTION };
