import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Database connected');
};
export default connectDB;
