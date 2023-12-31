import { Router } from "express";
import { authRoutes } from "./auth.route.js";
import { taskRoutes } from "./task.route.js";
import { userRoutes } from "./user.route.js";
import {categoryRoutes} from "./category.route.js"

const router = Router();

export const setRoutes = () => {
  router.use("/user", userRoutes());
  router.use("/auth", authRoutes());
  router.use("/task", taskRoutes());
  router.use("/category",categoryRoutes())
  return router;
};
