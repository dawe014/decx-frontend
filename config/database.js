import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
