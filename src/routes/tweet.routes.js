// routes/tweet.route.js
import express from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", verifyJWT, createTweet);


router.get("/user/:userId", getUserTweets);


router.put("/:tweetId", verifyJWT, updateTweet);


router.delete("/:tweetId", verifyJWT, deleteTweet);

export default router;
