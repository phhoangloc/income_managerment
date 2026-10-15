import { Router } from "express";
import { requireAuth } from "../lib/auth";
import { authController as c } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/login", c.login);
authRouter.get("/google/config", c.googleConfig);
authRouter.post("/google", c.google);
authRouter.post("/admin/login", c.adminLogin);
authRouter.get("/me", requireAuth, c.me);
