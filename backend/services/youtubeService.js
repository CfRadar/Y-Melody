import axios from 'axios';
import env from "../config/env.js";

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Simple in-memory cache to reduce API cost
const cache = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export const searchVideos = async (query) => {
    try {
        const normalizedQuery = query.trim().toLowerCase();
        const cachedItem = cache.get(normalizedQuery);
        
        if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION_MS)) {
            console.log(`[Cache Hit] YouTube Search: "${normalizedQuery}"`);
            return cachedItem.data;
        }

        console.log(`[Cache Miss] Fetching from YouTube API: "${normalizedQuery}"`);
        const response = await axios.get(`${BASE_URL}/search`,{
            params: {
                part : "snippet",
                q: query + " audio",
                key: env.YOUTUBE_DATA_API_KEY,
                maxResults: 25,
                type: "video",
                videoEmbeddable: "true"
            }
        });

        const data = response.data.items;
        
        // Save to cache
        cache.set(normalizedQuery, {
            data: data,
            timestamp: Date.now()
        });

        return data;
    }catch(error){
        console.error("Error searching videos:",error);
    }
};