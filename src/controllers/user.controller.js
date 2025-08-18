import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import User from "../models/User.js";

const registerUser = asyncHandler(async (req, res) => {
  // get all users details from frontend /  request body
  // validation / user must not be empty
  // check if user already exists
  // check for images / avatar
  // upload them to cloudinary
  // create user object - create entity in database
  // remove password and refresh token field from response
  // check for creation

  const { fullName, username, email, password } = req.body;
  console.log("email:", email);

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLOcalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const CoverImage = await uploadOnCloudinary(coverImageLOcalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    CoverImage: CoverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = User.findById((user._id).select("-password -refreshToken"))

  res.status(201).json({ message: "User registered successfully" });
});

export { registerUser };
