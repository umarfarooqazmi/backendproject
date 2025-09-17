
import express from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();


router.get("/", getAllVideos);


router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  publishAVideo
);


router.get("/:videoId", getVideoById);


router.put(
  "/:videoId",
  verifyJWT,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);


router.patch("/:videoId/toggle-publish", verifyJWT, togglePublishStatus);

export default router;
