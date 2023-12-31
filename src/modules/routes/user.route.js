import { Router } from "express";
import { protect } from "../middlewares/index.js";

import {
  changePassword,
  changeUsername,
} from "../controllers/user.controller.js";

const router = Router();

export const userRoutes = () => {
  router.use(protect);

  router.patch("/updateUsername/:id", changeUsername);
  router.put("/updatePassword", changePassword);

  return router;
};
