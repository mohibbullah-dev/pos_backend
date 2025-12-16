import { Table } from "../model/table.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess";
import asyncHandler from "../utils/asyncHandler.js";

const addTable = asyncHandler(async (req, res) => {
  const { tableNo } = req.body;
  if (!tableNo) throw new apiError(400, "rable is required");

  const table = await Table.create({
    tableNo,
  });

  return res
    .status(201)
    .json(new apiSuccess(201, "Table Created successfully", table));
});

export { addTable };
