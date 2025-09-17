import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ owner: channelId }).select("_id views");
  const videoIds = videos.map(v => v._id);

  const totalVideos = videos.length;
  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  return res.status(200).json(new ApiResponse(200, {
    totalVideos,
    totalViews,
    totalSubscribers,
    totalLikes
  }, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user._id; 
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ owner: channelId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalVideos = await Video.countDocuments({ owner: channelId });

  return res.status(200).json(new ApiResponse(200, {
    videos,
    total: totalVideos,
    page: parseInt(page),
    limit: parseInt(limit)
  }, "Channel videos fetched successfully"));
});

export {
  getChannelStats, 
  getChannelVideos
};
