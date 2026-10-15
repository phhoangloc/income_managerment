import { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../lib/errors";
import { parse } from "../lib/validate";
import { userService } from "../services/user.service";

const createSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
});
const updateSchema = createSchema.partial();

const idParam = (req: Request) => Number(req.params.id);

/** /users/me endpoints are for the logged-in user only. */
function selfId(req: Request) {
  if (req.auth!.role !== "user") throw new AppError(403, "User only");
  return req.auth!.id;
}

export const userController = {
  async me(req: Request, res: Response) {
    res.json(await userService.get(selfId(req)));
  },
  async updateMe(req: Request, res: Response) {
    res.json(await userService.update(selfId(req), parse(updateSchema, req.body)));
  },
  async removeMe(req: Request, res: Response) {
    await userService.remove(selfId(req));
    res.status(204).end();
  },

  async list(_req: Request, res: Response) {
    res.json(await userService.list());
  },
  async get(req: Request, res: Response) {
    res.json(await userService.get(idParam(req)));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await userService.create(parse(createSchema, req.body)));
  },
  async update(req: Request, res: Response) {
    res.json(await userService.update(idParam(req), parse(updateSchema, req.body)));
  },
  async remove(req: Request, res: Response) {
    await userService.remove(idParam(req));
    res.status(204).end();
  },
};
