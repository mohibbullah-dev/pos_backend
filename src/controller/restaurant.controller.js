import { Restaurant } from "../model/restaurant.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";
import { cloudinaryImageUpload } from "../utils/cloudinary.js";

const createRestaurant = asyncHandler(async (req, res) => {
  const { name, contact, address, openingHours, currency, taxPercent, status } =
    req.body;

  const ownerId = req?.user?.id;
  const localPath = req?.file?.path;

  if (
    !localPath ||
    !ownerId ||
    !name ||
    Object.keys(contact).length <= 0 ||
    !address ||
    Object.keys(openingHours).length <= 0 ||
    !currency ||
    !taxPercent ||
    !status
  )
    throw new apiError(400, "all fields are required");

  const key = name.replace(/\s+/g, "").toLowerCase();

  const exists = await Restaurant.findOne({ nameKey: key });
  if (exists) throw new apiError(400, "the Restaurant already exists");

  const response = await cloudinaryImageUpload(localPath, {
    folder: "restaurantLogo",
    use_filenames: true,
    overwrite: true,
    resource_type: "image",
    transformation: [
      { width: 300, height: 300, crop: "fill", gravity: "face" },
      { radius: "max" },
    ],
    public_id: Date.now(),
  });

  if (!response) throw new apiError(500, "cloudinary imageUpload faild!");

  const restaurant = await Restaurant.create({
    name,
    nameKey: key,
    contact,
    address,
    openingHours,
    currency,
    taxPercent,
    status,
    ownerId,
    restaurantLogo: {
      url: response?.url,
      public_id: response?.public_id,
    },
  });

  return res
    .status(201)
    .json(new apiSuccess(201, "Restaurant created success", restaurant));
});

export { createRestaurant };
