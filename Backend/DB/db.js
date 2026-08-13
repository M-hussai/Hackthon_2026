import mongoose from "mongoose";

const connectDB = async () => {
  const DBUri = process.env.MONGODB_URI || "mongodb+srv://<db_username>:9WDD9rzZKDItjmXC@myfirstcluster.dv9dblh.mongodb.net/?appName=MyFirstCluster";

  try {
    console.log("⏳ Connecting to MongoDB...");
    const conn = await mongoose.connect(DBUri);
    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("🔴 MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;