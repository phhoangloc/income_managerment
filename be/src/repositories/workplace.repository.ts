import { prisma } from "../lib/prisma";

export interface WorkplaceFilter {
  id?: number;
  userId?: number;
}

export const workplaceRepository = {
  findAll: (where: WorkplaceFilter) => prisma.workplace.findMany({ where, orderBy: { id: "asc" } }),
  findOne: (where: WorkplaceFilter) => prisma.workplace.findFirst({ where }),
  create: (data: { userId: number; name: string; wage: number }) =>
    prisma.workplace.create({ data }),
  update: (id: number, data: { name?: string; wage?: number }) =>
    prisma.workplace.update({ where: { id }, data }),
  delete: (id: number) => prisma.workplace.delete({ where: { id } }),
};
