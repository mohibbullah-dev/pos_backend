import { Order } from "../model/order.model.js";
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
    (!Array.isArray(items) || items.length) === 0 ||
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

const getOrder = asyncHandler(async (req, res) => {
  const orderId = req.params?.id;
  if (!orderId) throw new apiError(400, "order is required");
  const order = await Order.findById(orderId);
  if (!order) throw new apiError(404, "order not found");
  return res
    .status(200)
    .json(new apiSuccess(200, "order fetched successfully", order));
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  if (orders.length === 0 || !Array.isArray(orders))
    throw new apiError(404, "order not found");
  return res
    .status(200)
    .json(new apiSuccess(200, "orders fetched successfully", orders));
});

const updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.params?.id;
  if (!orderId) throw new apiError(400, "order is required");
  const order = await Order.findById(orderId);
  if (!order) throw new apiError(404, "order not found");
  order.orderStatus = "Ready";
  await order.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiSuccess(200, "order Updated successfully", order));
});

export { addOrder, getOrder, updateOrder, getOrders };
