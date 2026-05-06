import express from "express";
import cors from "cors";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import youtubeRoute from "./routes/youtubeRoute.js";

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/youtube", youtubeRoute);

app.listen(env.PORT, () =>{
    console.log(`Server active on port: ${env.PORT}`);
});