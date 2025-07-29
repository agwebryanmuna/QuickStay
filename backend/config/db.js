import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connection established 🎉");
  } catch (err) {
    console.log("MongoDB connection failed 😢", err);
  }
};

export default connectDb;
