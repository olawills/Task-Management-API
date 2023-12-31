import { Router } from "express";
import { protect } from "../middlewares/index.js";

import {
  createTask,
  deleteTaskById,
  getCompletedTaskById,
  getTaskById,
  getUnCompletedTaskById,
  updateTaskById
} from "../controllers/tasks.controller.js";

const router = Router();

export const taskRoutes = () => {
  // protect all route
  router.use(protect);

  router.get("/:id", getTaskById);
  router.post("/createTask", createTask);
  router.patch("/updateTask/:id", updateTaskById);
  router.delete("/deleteTask/:id", deleteTaskById);
  router.get("/completedTask/:id", getCompletedTaskById).get("/uncompletedTask/:id",getUnCompletedTaskById)

  return router;
};
