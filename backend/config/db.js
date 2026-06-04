import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected`);
        return true;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        return false;
    }
};
