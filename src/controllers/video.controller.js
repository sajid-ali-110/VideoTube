import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // get all videos from database
  // send response
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const queryObj = {};
  if (userId) queryObj.owner = userId;
  if (query) queryObj.title = { $regex: query, $options: "i" };
  const videos = await Video.aggregatePaginate(queryObj, {
    page,
    limit,
    sort: { [sortBy]: sortType },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  // get video file from request
  // upload to cloudinary
  // create video object
  // save to database
  // send response
  const { title, description } = req.body;
  const videoLocalPath = req.files?.video[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required!");
  }
  const video = await uploadCloudinary(videoLocalPath);
  if (!video) {
    throw new ApiError(400, "Video upload failed!");
  }
  const thumbnail = await uploadCloudinary(req.files?.thumbnail[0]?.path);
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail upload failed!");
  }
  const duration = await getVideoDuration(video.url);
  console.log("duration:", duration);
  const videoObj = await Video.create({
    title,
    description,
    videoFile: video.url,
    duration,
    thumbnail: thumbnail.url,
    owner: req.user?._id,
  });
  if (!videoObj) {
    throw new ApiError(400, "Video upload failed!");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, videoObj, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  // get video by id from database
  // send response
  const video = await Video.findById(req.params.id);
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }
  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  // get video by id from database
  // update video
  // send response
  const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }
  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    // get video by id from database
  // delete video
  // send response
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }
  
  return res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // get video by id from database
  // toggle publish status
  // send response
  const video = await Video.findByIdAndUpdate(req.params.id, { isPublished: !req.body.isPublished }, { new: true });
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }
  return res.status(200).json(new ApiResponse(200, video, "Video publish status toggled successfully"));
});

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
