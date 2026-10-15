import { Request, Response } from "express";
import { z } from "zod";
import { parse } from "../lib/validate";
import { authService } from "../services/auth.service";

const loginSchema = z.object({ username: z.string(), password: z.string() });

export const authController = {
  async login(req: Request, res: Response) {
    const { username, password } = parse(loginSchema, req.body);
    res.json(await authService.loginUser(username, password));
  },
  googleConfig(_req: Request, res: Response) {
    res.json({ clientId: authService.googleClientId() });
  },
  async google(req: Request, res: Response) {
    const { credential } = parse(z.object({ credential: z.string().min(1) }), req.body);
    res.json(await authService.loginGoogle(credential));
  },
  async adminLogin(req: Request, res: Response) {
    const { username, password } = parse(loginSchema, req.body);
    res.json(await authService.loginAdmin(username, password));
  },
  async me(req: Request, res: Response) {
    res.json(await authService.me(req.auth!));
  },
};
