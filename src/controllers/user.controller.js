import { asyncHandler } from "../utils/asyncHandler.js";
// import User from "../models/User.js";

const registerUser = asyncHandler(async (req, res) => {
  //   const { name, email, password } = req.body;
  //   const user = new User({ name, email, password });
  //   await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

export { registerUser };
