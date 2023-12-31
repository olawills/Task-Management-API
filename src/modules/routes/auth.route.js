import { Router } from "express";
import { login,  signup } from "../controllers/auth.controller.js";


const router = Router();

export const authRoutes = () => {
  /**
   * user auth
   */
  router.post("/signup", signup);
  router.post("/login", login);

  return router;
};
