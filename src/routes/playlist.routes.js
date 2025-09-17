// routes/playlist.route.js
import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", verifyJWT, createPlaylist);


router.get("/user/:userId", getUserPlaylists);


router.get("/:playlistId", getPlaylistById);


router.post("/:playlistId/videos/:videoId", verifyJWT, addVideoToPlaylist);


router.delete("/:playlistId/videos/:videoId", verifyJWT, removeVideoFromPlaylist);

router.put("/:playlistId", verifyJWT, updatePlaylist);


router.delete("/:playlistId", verifyJWT, deletePlaylist);

export default router;
