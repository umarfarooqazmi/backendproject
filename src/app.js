import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"; 
import commentRoutes from "./routes/comment.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import healthRoutes from "./routes/healthcheck.routes.js";
import likeRoutes from "./routes/like.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import tweetRoutes from "./routes/tweet.route.js";
import videoRoutes from "./routes/video.route.js";




const app = express()

app.use(cors({
  origin:  process.env.CORS_ORIGIN,
  credentials: true
})) 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
//routes
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/videos", videoRoutes);
export {app}
