import { apiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

const menuCreate = asyncHandler(async (req, res) => {
  const { name, icon, color, dishes } = req.body;
  if (!name || !icon || !color)
    throw new apiError(400, "all fields are required");
  if (Object.keys(dishes).length === 0)
    throw new apiError(400, "dihes are required");
});
