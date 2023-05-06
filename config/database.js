import mongoose from "mongoose";

// MONGO_URI=mongodb://localhost:27017/cemaenglishcenter ==> local
// MONGO_URI=mongodb+srv://minhnguyet050301:Namba2001916@cemaenglishcenter.hyq5svu.mongodb.net/?retryWrites=true&w=majority  ==> mongooDB alats
export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`MongoDB Connected: ${connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};
