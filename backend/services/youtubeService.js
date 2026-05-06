import axios from 'axios';
import env from "../config/env.js";

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const searchVideos = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`,{
            params: {
                part : "snippet",
                q: query,
                key: env.YOUTUBE_DATA_API_KEY,
                maxResults: 5,
                type: "video"
            }
        });

        return response.data.items;
    }catch(error){
        console.error("Error searching videos:",error);
    }
};