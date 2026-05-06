import moongoose from 'mongoose';
import env from "./env.js";

const connectDB = async () => {
    try{
        await moongoose.connect(env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;