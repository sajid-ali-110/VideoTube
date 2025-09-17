import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyJwt);

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

  router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

  router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
