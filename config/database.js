import mongoose from "mongoose";

// MONGO_URI=mongodb://127.0.0.1:27017/cemaenglishcenter ==> local

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};
