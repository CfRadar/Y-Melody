import express from 'express';
import { searchVideos } from '../services/youtubeService.js';

const router = express.Router();

router.get('/search', async (req,res) => {
    try{
        const { q } = req.query;

        const videos = await searchVideos(q);

        res.json(videos);
    }catch(error){
        console.error("Error in YouTube search route:", error);
    }
})

export default router;