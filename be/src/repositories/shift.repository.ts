import { prisma } from "../lib/prisma";

export interface ShiftFilter {
  id?: number;
  userId?: number;
  month?: string; // YYYY-MM
}

export interface ShiftData {
  userId: number;
  workplaceId: number;
  timeStart: Date;
  timeEnd: Date;
  break: number;
  workingHours: number;
  dailyIncome: number;
  workingDate: Date;
}

export type ShiftRow = Awaited<ReturnType<typeof prisma.shift.findFirstOrThrow>>;

function toWhere({ month, ...rest }: ShiftFilter) {
  if (!month) return rest;
  const [y, m] = month.split("-").map(Number);
  return {
    ...rest,
    workingDate: { gte: new Date(Date.UTC(y, m - 1, 1)), lt: new Date(Date.UTC(y, m, 1)) },
  };
}

export const shiftRepository = {
  findAll: (filter: ShiftFilter) =>
    prisma.shift.findMany({
      where: toWhere(filter),
      orderBy: [{ workingDate: "asc" }, { timeStart: "asc" }],
    }),
  findOne: (filter: ShiftFilter) => prisma.shift.findFirst({ where: toWhere(filter) }),
  createMany: (rows: ShiftData[]) =>
    prisma.$transaction(rows.map((data) => prisma.shift.create({ data }))),
  update: (id: number, data: Omit<ShiftData, "userId">) =>
    prisma.shift.update({ where: { id }, data }),
  delete: (id: number) => prisma.shift.delete({ where: { id } }),
};
