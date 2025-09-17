import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // toggle subscription
  // send response
  const { userId } = req.params;
  const subscription = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: userId,
  });
  if (subscription) {
    await subscription.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, subscription, "Subscription removed successfully")
      );
  }
  const newSubscription = await Subscription.create({
    subscriber: req.user?._id,
    channel: userId,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, newSubscription, "Subscription added successfully")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const channels = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel");
  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Channels fetched successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
