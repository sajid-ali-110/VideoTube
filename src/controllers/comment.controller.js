import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getVideoComments = asyncHandler(async (req, res) => {
  // get video by id from database
  const {videoId} = req.params; 
  const {page = 1, limit = 10} = req.query;

  const comments = await Comment.aggregatePaginate({video: videoId}, {page, limit, sort: {createdAt: -1}});
  if (!comments) {
    throw new ApiError(404, "Comments not found!");
  }
  return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // create comment
  // send response
  req.body.owner = req.user?._id;
  req.body.video = req.params.videoId;
  const comment = await Comment.create(req.body);
  if (!comment) {
    throw new ApiError(400, "Comment creation failed!");
  }
  return res.status(201).json(new ApiResponse(201, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // update comment
  // send response
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!comment) {
    throw new ApiError(404, "Comment not found!");
  }
  return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // delete comment
  // send response
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) {
    throw new ApiError(404, "Comment not found!");
  }
  return res.status(200).json(new ApiResponse(200, comment, "Comment deleted successfully"));
});
export { getVideoComments, addComment, updateComment, deleteComment };
