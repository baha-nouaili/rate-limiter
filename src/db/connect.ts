import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI as string;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 2000;

export const connectToMongo = async (retryCount = 1) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("successfully connected to MONGODB");
  } catch (error: any) {
    console.error("Error while connection to MONGODB..");
    console.error(error.message);

    if (retryCount <= MAX_RETRIES) {
      console.error(
        `Retrying connection in ${RETRY_INTERVAL}ms (Attempt ${retryCount})...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      await connectToMongo(retryCount + 1);
    } else {
      console.error(
        `Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Exiting...`
      );
      process.exit(1);
    }
  }
};
