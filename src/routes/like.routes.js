import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos } from "../controllers/like.controller";

const router = Router();
router.use(verifyJwt);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
export default router;