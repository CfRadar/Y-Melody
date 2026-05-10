import express from 'express';
import authMiddleware from "../middlewares/authMiddleware.js";
import {registerUser} from '../controllers/registerUser.js';
import { signinUser } from "../controllers/signinUser.js";
import { getPlaylists } from "../controllers/getPlaylists.js";
import { createPlaylist } from "../controllers/createPlaylist.js";
import { deletePlaylist } from "../controllers/deletePlaylist.js";
import { renamePlaylist } from "../controllers/renamePlaylist.js";
import { addSongToPlaylist } from "../controllers/addSongToPlaylist.js";
import { deleteSongFromPlaylist } from "../controllers/deleteSongFromPlaylist.js";
import { reorderPlaylistSongs } from "../controllers/reorderPlaylistSongs.js";
import { addToHistory } from "../controllers/addToHistory.js";
import { addNotification } from "../controllers/addNotification.js";
import { deleteNotification } from "../controllers/deleteNotification.js";
import { getNotifications } from "../controllers/getNotifications.js";
import { getProfile } from "../controllers/getProfile.js";

const router = express.Router();

router.post('/register', registerUser);
router.post("/signin", signinUser);
router.get("/playlists", authMiddleware, getPlaylists);
router.post("/playlist/create", authMiddleware, createPlaylist);
router.delete("/playlist/delete", authMiddleware, deletePlaylist);
router.put("/playlist/rename", authMiddleware, renamePlaylist);
router.post("/playlist/song/add", authMiddleware, addSongToPlaylist);
router.delete("/playlist/song/delete", authMiddleware, deleteSongFromPlaylist);
router.put("/playlist/song/reorder", authMiddleware, reorderPlaylistSongs);
router.post("/history/add", authMiddleware, addToHistory);
router.post("/notification/add", authMiddleware, addNotification);
router.delete("/notification/delete", authMiddleware, deleteNotification);
router.get("/notifications", authMiddleware, getNotifications);
router.get("/profile", authMiddleware, getProfile);

export default router;