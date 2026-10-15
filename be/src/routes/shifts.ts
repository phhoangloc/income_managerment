import { Router } from "express";
import { requireAuth } from "../lib/auth";
import { shiftController as c } from "../controllers/shift.controller";

export const shiftsRouter = Router();
shiftsRouter.use(requireAuth);

shiftsRouter.get("/", c.list);
shiftsRouter.post("/", c.create);
shiftsRouter.get("/:id", c.get);
shiftsRouter.put("/:id", c.update);
shiftsRouter.delete("/:id", c.remove);
