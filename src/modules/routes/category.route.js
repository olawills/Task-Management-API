import { Router } from "express";
import {
  createCategory,
  getCategoryById,
} from "../controllers/category.controller.js";
import { protect } from "../middlewares/index.js";

const router = Router();

export const categoryRoutes = () => {
  // protect all route
  router.use(protect);

  router.get("/getCategory/:id", getCategoryById);
  router.post("/createCategory", createCategory);

  return router;
};
