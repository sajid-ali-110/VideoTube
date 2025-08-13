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
  console.log("email:", email)

  res.status(201).json({ message: "User registered successfully" });
});

export { registerUser };
