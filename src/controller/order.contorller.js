import mongoose from "mongoose";
import { Order } from "../model/order.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

const addOrder = asyncHandler(async (req, res) => {
  const { customerDetails, orderStatus, bills, items, table } = req.body;
  const userId = req.user?.id;
  const restaurantId = req?.restaurantId;
  if (
    Object.keys(customerDetails).length === 0 ||
    Object.keys(bills).length === 0 ||
    !orderStatus ||
    (!Array.isArray(items) || items.length) === 0 ||
    !userId ||
    !table ||
    !restaurantId
  )
    throw new apiError(400, "all fields are required");

  const order = await Order.create({
    customerDetails,
    orderStatus,
    createdBy: userId,
    bills,
    items,
    restaurantId,
    table,
  });

  return res
    .status(201)
    .json(new apiSuccess(201, "order created successfully", order));
});

const getOrder = asyncHandler(async (req, res) => {
  const orderId = req?.params?.id;
  const restaurantId = req?.restaurantId;
  if (!mongoose.Types.ObjectId.isValid(orderId) || !restaurantId)
    throw new apiError(
      400,
      "it's not a valide ObjectId or restaurant is required"
    );
  const order = await Order.findOne({ _id: orderId, restaurantId });
  if (!order) throw new apiError(404, "order not found");
  return res
    .status(200)
    .json(new apiSuccess(200, "order fetched successfully", order));
});

const getOrders = asyncHandler(async (req, res) => {
  const restaurantId = req?.restaurantId;
  if (!restaurantId) throw new apiError("400", "restaurant is required");
  const orders = await Order.aggregate([
    { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
    {
      $lookup: {
        from: "tables",
        localField: "table",
        foreignField: "_id",
        as: "table",
      },
    },
  ]);
  if (orders.length === 0 || !Array.isArray(orders))
    throw new apiError(404, "order not found");
  return res
    .status(200)
    .json(new apiSuccess(200, "orders fetched successfully", orders));
});

const updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.params?.id;
  const restaurantId = req?.restaurantId;
  if (!mongoose.Types.ObjectId.isValid(orderId) || !restaurantId)
    throw new apiError(
      400,
      "it's not a valide ObjectId OR Restaurant is required"
    );
  const order = await Order.findOne({ _id: orderId, restaurantId });
  if (!order) throw new apiError(404, "order not found");
  order.orderStatus = "Ready";
  await order.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiSuccess(200, "order Updated successfully", order));
});

export { addOrder, getOrder, updateOrder, getOrders };
