import { z } from "zod";
import { AppError } from "./errors";

export function parse<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const r = schema.safeParse(data);
  if (!r.success) throw new AppError(400, "Invalid input", r.error.flatten());
  return r.data;
}
