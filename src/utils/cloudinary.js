import { V2 as Cloudinary } from "cloudinary";
import fs from "fs";

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
        // upload the file to Cloudinary
        const response = await Cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file uploaded successfully, remove the local file
        return response.secure_url; // Return the URL of the uploaded file
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file after upload operatuion got failed.
        return null; // Return null if upload fails
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Cloudinary upload failed");
    }
}
export { Cloudinary, uploadCloudinary };