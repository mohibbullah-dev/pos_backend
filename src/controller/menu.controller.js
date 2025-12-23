import { Menu } from "../model/menu.model";
import { apiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

const menuCreate = asyncHandler(async (req, res) => {
  const { name, icon, color, dishes } = req.body;
  if (!name || !icon || !color)
    throw new apiError(400, "all fields are required");
  if (Object.keys(dishes).length <= 0)
    throw new apiError(400, "dihes are required");

  const resutl = await Menu.findOneAndUpdate(
    { name },
    { name, icon, color, dishes },
    { new: true, upsert: true, includeResultMetadata: true }
  );
  if (!resutl.value) throw new apiError(500, "menu creation faild!");

  const created = resutl.lastErrorObject.updatedExisting === false;

  return res
    .status(created ? 201 : 200)
    .json(created ? 201 : 200, resutl.value);
});

export { menuCreate };
