import express from 'express';
import { searchVideos } from '../services/youtubeService.js';

const router = express.Router();

router.get('/search', async (req,res) => {
    try{
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                status: false,
                message: "Search query is required"
            });
        }

        const videos = await searchVideos(q);

        res.json(videos);
    }catch(error){
        console.error("Error in YouTube search route:", error);
        res.status(500).json({
            status: false,
            message: "Error searching videos"
        });
    }
})

export default router;