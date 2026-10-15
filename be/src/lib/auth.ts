import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config";

export type Role = "admin" | "user";
export interface AuthPayload {
  id: number;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthPayload;
  }
}

export const signToken = (p: AuthPayload) => jwt.sign(p, config.jwtSecret, { expiresIn: "7d" });

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { id, role } = jwt.verify(header.slice(7), config.jwtSecret) as AuthPayload;
    req.auth = { id, role };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}

/** Users only touch their own rows; admin touches everything. */
export const scope = (auth: AuthPayload) => (auth.role === "admin" ? {} : { userId: auth.id });
