import { Request, Response } from "express";
import { z } from "zod";
import { parse } from "../lib/validate";
import { shiftService, toView } from "../services/shift.service";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeStr = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const breakVal = z.coerce.number().refine((n) => [0, 0.25, 0.5, 0.75].includes(n), {
  message: "break must be 0, 0.25, 0.5 or 0.75",
});

const base = z.object({
  startTime: timeStr,
  endTime: timeStr,
  workplaceId: z.number().int(),
  break: breakVal.default(0),
  userId: z.number().int().optional(), // admin only
});
const createSchema = base.extend({ dates: z.array(dateStr).min(1) });
const updateSchema = base.omit({ userId: true }).partial().extend({ date: dateStr.optional() });

const idParam = (req: Request) => Number(req.params.id);

export const shiftController = {
  async list(req: Request, res: Response) {
    const month = /^\d{4}-\d{2}$/.test(String(req.query.month)) ? String(req.query.month) : undefined;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    res.json(await shiftService.list(req.auth!, month, userId));
  },
  async get(req: Request, res: Response) {
    res.json(toView(await shiftService.get(req.auth!, idParam(req))));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await shiftService.create(req.auth!, parse(createSchema, req.body)));
  },
  async update(req: Request, res: Response) {
    const data = parse(updateSchema, req.body);
    res.json(await shiftService.update(req.auth!, idParam(req), data));
  },
  async remove(req: Request, res: Response) {
    await shiftService.remove(req.auth!, idParam(req));
    res.status(204).end();
  },
};
