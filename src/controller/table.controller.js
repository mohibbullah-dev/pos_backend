import { Table } from "../model/table.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

const addTables = asyncHandler(async (req, res) => {
  const { tableNo } = req.body;
  if (!tableNo) throw new apiError(400, "rable is required");
  const exist = await Table.findOne({ tableNo });
  if (exist) throw new apiError(400, "table aready exists");

  const table = await Table.create({
    tableNo,
  });

  return res
    .status(201)
    .json(new apiSuccess(201, "Table Created successfully", table));
});

const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find();
  if (!Array.isArray(tables) || !tables.length > 0)
    throw new apiError(404, "tables not founds");
  return res
    .status(200)
    .json(new apiSuccess(200, "all tables fetched", tables));
});

export { addTables, getTables };
