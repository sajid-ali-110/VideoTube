import { Router } from "express";
import {
  loginUser,
  logoutUser,
  changePassword,
  getCurrentUser,
  getUserChannelProfile,
  refreshAccessToken,
  registerUser,
  updateAccountSettings,
  updateUserAvatar,
  getUserWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changePassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountSettings);
router
  .route("/avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJwt, getUserChannelProfile);
router.route("/history").get(verifyJwt, getUserWatchHistory);

export default router;
