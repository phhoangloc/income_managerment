import { Router } from "express";
import { requireAdmin, requireAuth } from "../lib/auth";
import { userController as c } from "../controllers/user.controller";

export const usersRouter = Router();
usersRouter.use(requireAuth);

// current user (declared before /:id)
usersRouter.get("/me", c.me);
usersRouter.put("/me", c.updateMe);
usersRouter.delete("/me", c.removeMe);

// admin only
usersRouter.get("/", requireAdmin, c.list);
usersRouter.post("/", requireAdmin, c.create);
usersRouter.get("/:id", requireAdmin, c.get);
usersRouter.put("/:id", requireAdmin, c.update);
usersRouter.delete("/:id", requireAdmin, c.remove);
