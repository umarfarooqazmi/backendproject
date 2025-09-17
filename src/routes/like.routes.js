// routes/like.route.js
import express from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/video/:videoId", verifyJWT, toggleVideoLike);

router.post("/comment/:commentId", verifyJWT, toggleCommentLike);

router.post("/tweet/:tweetId", verifyJWT, toggleTweetLike);

router.get("/videos", verifyJWT, getLikedVideos);

export default router;
