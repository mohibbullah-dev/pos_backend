import { Order } from "../model/order.model";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

const addOrder = asyncHandler(async (req, res) => {
  const { customerDetails, orderStatus, bills, items } = req.body;
  const userId = req.user?.id;
  if (
    Object.keys(customerDetails).length === 0 ||
    Object.keys(bills).length === 0 ||
    !orderStatus ||
    (!Array.isArray(items) === items.length) === 0 ||
    !userId
  )
    throw new apiError(
      400,
      "custormerDetails, bills,orderStatus, createdBy and items are required"
    );

  const order = await Order.create({
    customerDetails,
    orderStatus,
    createdBy: userId,
    bills,
    items,
  });

  return res
    .status(201)
    .json(new apiSuccess(201, "order created successfully", order));
});

export { addOrder };
