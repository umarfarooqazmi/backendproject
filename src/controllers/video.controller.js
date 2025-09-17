import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    query = "", 
    sortBy = "createdAt", 
    sortType = "desc", 
    userId 
  } = req.query;

  const filter = {};

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ];
  }

  if (userId && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  const sortOrder = sortType === "asc" ? 1 : -1;

  const videos = await Video.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("owner", "username email");

  const total = await Video.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      videos
    }, "Videos fetched successfully")
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.files || !req.files.video) {
    throw new ApiError(400, "Video file is required");
  }

  const videoUpload = await uploadOnCloudinary(req.files.video[0].path);

  let thumbnailUrl = "";
  if (req.files.thumbnail) {
    const thumbUpload = await uploadOnCloudinary(req.files.thumbnail[0].path);
    thumbnailUrl = thumbUpload.url;
  }

  const video = await Video.create({
    title,
    description,
    videoUrl: videoUpload.url,
    thumbnail: thumbnailUrl,
    owner: req.user._id,
    isPublished: false
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "username email");

  if (!video) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  if (req.files && req.files.thumbnail) {
    const thumbUpload = await uploadOnCloudinary(req.files.thumbnail[0].path);
    video.thumbnail = thumbUpload.url;
  }

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not allowed to delete this video");
  }

  await video.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not allowed to toggle publish status");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
};
