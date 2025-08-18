import cloudinary from "cloudinary";
import fs from "fs";

const Cloudinary = cloudinary.v2;

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided for upload");
    }

    // Upload file
    const response = await Cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete local file after upload
    fs.unlinkSync(localFilePath);

    return response; // <-- return whole object (has .url and .secure_url)
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // cleanup if failed
    }
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

export { Cloudinary, uploadCloudinary };
