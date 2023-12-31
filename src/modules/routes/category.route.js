import { Router } from "express";
import { protect } from "../middlewares/index.js";
import {
    createCategory,
    getCategoryById,
} from "../controllers/category.controller.js";

const router = Router();

export const categoryRoutes = () => {
  // protect all route
  router.use(protect);

  router.get("/:id", getCategoryById);
  router.post("/createCategory", createCategory);

  return router;
};
