import { Menu } from "../model/menu.model.js";
import { apiError } from "../utils/apiError.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

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
    .json(
      new apiSuccess(
        created ? 201 : 200,
        created ? "new menu created success" : "the same updated success"
      )
    );
});

export { menuCreate };
