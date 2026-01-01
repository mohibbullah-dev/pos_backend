import { RestaurantPaymentConfig } from "../model/restaurantPaymentConfig.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

const creatPaymenConfig = asyncHandler(async (req, res) => {
  const restaurantId = req.restaurantId;
  const { provider, stripeSecretKey, webhookStripeSecretKey, defaultCurrency } =
    req.body;
  if (!restaurantId) throw new apiError(400, "restaurantId field is required");
  if ((!provider, !stripeSecretKey, !webhookStripeSecretKey))
    throw new apiError(400, "all fields are required!");

  const cfg = await RestaurantPaymentConfig.findOneAndUpdate(
    { restaurantId },
    {
      restaurantId,
      provider,
      stripeSecretKey,
      webhookStripeSecretKey,
      defaultCurrency,
    },
    { new: true, upsert: true, runValidators: true }
  );

  return res
    .status(201)
    .json(new apiSuccess(201, "payment setup SUCCEEDED", cfg));
});

export { creatPaymenConfig };
