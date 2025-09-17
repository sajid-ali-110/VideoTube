import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  // toggle like
  // send response
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }
  const like = await Like.findOne({
    video: videoId,
    owner: req.user?._id,
    comment: null,
    tweet: null,
  });
  if (like) {
    await like.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Like removed successfully"));
  }
  const newLike = await Like.create({
    video: videoId,
    owner: req.user?._id,
    likedBy: req.user?._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Like added successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  // toggle like
  // send response
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found!");
  }
  const like = await Like.findOne({
    comment: commentId,
    owner: req.user?._id,
    video: null,
    tweet: null,
  });
  if (like) {
    await like.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Like removed successfully"));
  }
  const newLike = await Like.create({
    comment: commentId,
    owner: req.user?._id,
    likedBy: req.user?._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Like added successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  // toggle like
  // send response
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found!");
  }
  const like = await Like.findOne({
    tweet: tweetId,
    owner: req.user?._id,
    video: null,
    comment: null,
  });
  if (like) {
    await like.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Like removed successfully"));
  }
  const newLike = await Like.create({
    tweet: tweetId,
    owner: req.user?._id,
    likedBy: req.user?._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Like added successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // get liked videos
  // send response
  const likes = await User.aggregate([
    { $match: { _id: req.user?._id } },
    { $unwind: "$likes" },
    {
      $lookup: {
        from: "videos",
        localField: "likes.video",
        foreignField: "_id",
        as: "video",
      },
    },
    { $unwind: "$video" },
    { $project: { video: 1, _id: 0 } },
    { $sort: { "video.createdAt": -1 } },
  ]);
  if (!likes) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No liked videos found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Liked videos fetched successfully"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
