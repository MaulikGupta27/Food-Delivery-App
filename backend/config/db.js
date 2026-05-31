import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Do not exit the process here; allow the server to start so
        // the developer can see error details and fix env/config without
        // the whole app crashing during development.
        // The function returns false to indicate connection failure.
        return false;
    }
};
