import { Request, Response } from "express";
import { z } from "zod";
import { parse } from "../lib/validate";
import { workplaceService } from "../services/workplace.service";

const schema = z.object({
  name: z.string().min(1),
  wage: z.coerce.number().nonnegative(),
  userId: z.number().int().optional(), // admin only
});

const idParam = (req: Request) => Number(req.params.id);

export const workplaceController = {
  async list(req: Request, res: Response) {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    res.json(await workplaceService.list(req.auth!, userId));
  },
  async get(req: Request, res: Response) {
    res.json(await workplaceService.get(req.auth!, idParam(req)));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await workplaceService.create(req.auth!, parse(schema, req.body)));
  },
  async update(req: Request, res: Response) {
    const data = parse(schema.partial(), req.body);
    res.json(await workplaceService.update(req.auth!, idParam(req), data));
  },
  async remove(req: Request, res: Response) {
    await workplaceService.remove(req.auth!, idParam(req));
    res.status(204).end();
  },
};
