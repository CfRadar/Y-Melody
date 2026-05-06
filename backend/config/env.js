import dotenv from "dotenv";

dotenv.config();

let env = {};
try {
    env = {
        PORT: process.env.PORT,
        MONGODB_URI: process.env.DATABASE_URL,
        YOUTUBE_DATA_API_KEY: process.env.YOUTUBE_DATA_API_KEY,
    };
} catch (error) {
    console.error("Error loading environment variables:", error);
}

export default env;