import { Router } from "express";
import { requireAuth } from "../lib/auth";
import { workplaceController as c } from "../controllers/workplace.controller";

export const workplacesRouter = Router();
workplacesRouter.use(requireAuth);

workplacesRouter.get("/", c.list);
workplacesRouter.post("/", c.create);
workplacesRouter.get("/:id", c.get);
workplacesRouter.put("/:id", c.update);
workplacesRouter.delete("/:id", c.remove);
