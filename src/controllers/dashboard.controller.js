import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const stats = await Video.aggregate([
    {
      $match: { channel: channelId },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likes" },
      },
    },
  ]);
  if (!stats[0]) {
    return res
      .status(200)
      .json(new ApiResponse(200, { totalVideos: 0, totalViews: 0, totalLikes: 0 }, "Channel stats fetched successfully"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, stats[0], "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const videos = await Video.find({ channel: channelId }).sort({
    createdAt: -1,
  });
  if (!videos) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Channel videos fetched successfully"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
