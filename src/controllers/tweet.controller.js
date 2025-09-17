import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createTweet = asyncHandler(async (req, res) => {
  // get tweet from request body
  // create tweet
  // send response
  const { tweet } = req.body;
  if (!tweet?.trim()) {
    throw new ApiError(400, "Tweet is required!");
  }
  const tweetObj = await Tweet.create({
    tweet,
    owner: req.user?._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, tweetObj, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // get user tweets
  // send responsee
  const { userId } = req.params;
  const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  // update tweet
  // send response
  const { tweetId } = req.params;
  const { tweet } = req.body;
  const tweetObj = await Tweet.findByIdAndUpdate(tweetId, { tweet });
  return res
    .status(200)
    .json(new ApiResponse(200, tweetObj, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // delete tweet
  // send response
  const { tweetId } = req.params;
  const tweetObj = await Tweet.findByIdAndDelete(tweetId);
  return res
    .status(200)
    .json(new ApiResponse(200, tweetObj, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
