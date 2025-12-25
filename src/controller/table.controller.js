import mongoose from "mongoose";
import { Table } from "../model/table.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

const addTables = asyncHandler(async (req, res) => {
  const { tableNo, seatNo } = req.body;
  const userId = req?.user?.id;
  const restaurantId = req?.restaurantId;
  if (!tableNo || !seatNo || !userId || !restaurantId)
    throw new apiError(400, "tableNo & seatNo are required");
  const exist = await Table.findOne({ tableNo });
  if (exist) throw new apiError(400, "table aready exists");

  const table = await Table.create({
    tableNo,
    seatNo,
    createdBy: userId,
    restaurantId,
  });

  return res
    .status(201)
    .json(new apiSuccess(201, "Table Created successfully", table));
});

const getTables = asyncHandler(async (req, res) => {
  const restaurantId = req?.user?.restaurantId;
  const tables = await Table.find({ restaurantId });
  if (tables.length === 0) throw new apiSuccess(200, "no tables yet");
  return res
    .status(200)
    .json(new apiSuccess(200, "all tables fetched", tables));
});

const updateTable = asyncHandler(async (req, res) => {
  const { tableStatus, currentOrder } = req.body;
  const tableId = req.params?.id;
  const restaurantId = req?.user?.restaurantId;
  if (!tableStatus || !currentOrder || !restaurantId)
    throw new apiError(400, "all file are required", updateTable);
  if (!mongoose.Types.ObjectId.isValid(tableId))
    throw new apiError(400, "it's not a valide ObjectId");

  const table = await Table.findOneAndUpdate(
    { _id: tableId, restaurantId },
    { tableStatus, currentOrder },
    { new: true }
  );
  if (!table) throw new apiError(404, "table not found");
  return res
    .status(200)
    .json(new apiSuccess(200, "table updated successfully", table));
});

export { addTables, getTables, updateTable };
