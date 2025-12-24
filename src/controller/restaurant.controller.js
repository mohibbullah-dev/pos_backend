import { Restaurant } from "../model/restaurant.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

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

  const exists = await Restaurant.findOne({ name });
  if (exists) throw new apiError(400, "the Restaurant already exists");
  const restaurant = await Restaurant.create({
    name,
    contact,
    address,
    openingHours,
    currency,
    taxPercent,
    status,
    ownerId,
  });

  return res
    .status(201)
    .json(new apiSuccess(201, "Restaurant created success", restaurant));
});

export { createRestaurant };
