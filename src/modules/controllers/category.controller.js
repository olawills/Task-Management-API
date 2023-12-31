import AppError from "../../common/utils/appError.js";
import { catchAsync } from "../../common/utils/errorHandler.js";
import CategoryModel from "../../modules/schemas/category.schema.js";
import { create, getAll } from "../repository/index.js";


// Add Category
export const createCategory = catchAsync(async (req, res, next) => {
    const category = await create(CategoryModel, req.body);
    res.status(200).json({
      status: "success",
      message: "category successfully created",
      category,
    });
  });
  
  
  // by using the userId u can get  all categories created by a particular user
  export const getCategoryById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const category = await getAll(id, CategoryModel)
    if (!category) {
      return next(new AppError("ID does not exist", 401));
    }
    res.status(200).json({
      status: "success",
      category,
    });
  });
  