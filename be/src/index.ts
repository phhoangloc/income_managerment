import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./lib/config";
import { AppError } from "./lib/errors";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { workplacesRouter } from "./routes/workplaces";
import { shiftsRouter } from "./routes/shifts";

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/workplaces", workplacesRouter);
app.use("/shifts", shiftsRouter);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError)
    return res.status(err.status).json({ error: err.message, details: err.details });
  console.error(err);
  if (err?.code === "P2002") return res.status(409).json({ error: "Already exists" });
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => console.log(`API on http://localhost:${config.port}`));
