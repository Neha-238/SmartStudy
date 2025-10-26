import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
