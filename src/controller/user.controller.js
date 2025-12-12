import { User } from "../model/user.model.js";
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { cloudinaryImageUpload } from "../utils/cloudinary.js";

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const localPath = req.file;

  if (!name || !email || !password || !role || !localPath)
    throw new apiError(400, "all fields are required");

  const exist = await User.findOne({ email });
  if (exist) throw new apiError(400, "user already exists");

  const cloudinaryRes = await cloudinaryImageUpload(localPath, {
    folder: "restaurantAvatar",
    use_filenames: true,
    overwrite: true,
    resource_type: "image",
    transformation: [
      { width: 300, height: 300, crop: "fill", gravity: "face" },
      { radius: "max" },
    ],
    public_id: Date.now(),
  });

  if (cloudinaryRes.secure_url && cloudinaryRes.public_id) {
    const createUser = await User.create({
      name,
      email,
      password,
      role,
    }).select("-password");

    if (!createUser)
      throw new apiError(500, " something went wrong when user creating");

    return res
      .status(201)
      .json(new apiSuccess(201, "user created successfully", createUser));
  }
});

export { signUp };
