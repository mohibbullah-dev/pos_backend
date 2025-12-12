import { v2 as cloudinary } from "cloudinary";
import { existsSync, unlinkSync } from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "../constant.js";
import { apiError } from "./apiError.js";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

//  {
//     folder: 'avatar',
//     use_filenames: true,
//     // unique_filename: true,
//     overwrite: true,
//     resource_type: 'image',
//     transformation: [
//       { width: 300, height: 300, crop: 'fill', gravity: 'face' },
//       { radius: 'max' },
//     ],
//     public_id: req.user._id,
//   }

const cloudinaryImageUpload = async (locatPath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(locatPath, { ...options });
    if (existsSync(locatPath)) unlinkSync(locatPath);
    return result;
  } catch (error) {
    if (existsSync(locatPath)) unlinkSync(locatPath);
    throw new apiError(500, "cloudinaryImageUpload is faild!", error.message);
  }
};

const cloudinaryImageDelete = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {}
};

export { cloudinaryImageUpload, cloudinaryImageDelete };
