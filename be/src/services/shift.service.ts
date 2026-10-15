import { AppError, notFound } from "../lib/errors";
import { AuthPayload } from "../lib/auth";
import { calcShift, dateToLocalDate, dateToLocalTime, localToDate } from "../lib/income";
import { shiftRepository, ShiftRow } from "../repositories/shift.repository";
import { workplaceRepository } from "../repositories/workplace.repository";

const owner = (auth: AuthPayload) => (auth.role === "admin" ? {} : { userId: auth.id });

export const toView = (s: ShiftRow) => ({
  id: s.id,
  userId: s.userId,
  workplaceId: s.workplaceId,
  timeStart: s.timeStart,
  timeEnd: s.timeEnd,
  date: dateToLocalDate(s.timeStart),
  startTime: dateToLocalTime(s.timeStart),
  endTime: dateToLocalTime(s.timeEnd),
  break: Number(s.break),
  workingHours: Number(s.workingHours),
  dailyIncome: Number(s.dailyIncome),
  workingDate: s.workingDate.toISOString().slice(0, 10),
});

/** Resolve the shift's start/end; an end time <= start time means the next day. */
function build(
  date: string,
  startTime: string,
  endTime: string,
  breakHours: number,
  wage: number,
  workplaceId: number,
) {
  const start = localToDate(date, startTime);
  let end = localToDate(date, endTime);
  if (end <= start) end = new Date(end.getTime() + 24 * 3_600_000);
  const calc = calcShift(start, end, breakHours, wage);
  return {
    workplaceId,
    timeStart: start,
    timeEnd: end,
    break: breakHours,
    workingHours: calc.workingHours,
    dailyIncome: calc.dailyIncome,
    workingDate: new Date(`${date}T00:00:00Z`),
  };
}

async function findWorkplace(id: number, userId: number) {
  const wp = await workplaceRepository.findOne({ id, userId });
  if (!wp) throw new AppError(400, "Workplace not found");
  return wp;
}

export interface CreateShiftInput {
  dates: string[];
  startTime: string;
  endTime: string;
  workplaceId: number;
  break: number;
  userId?: number;
}

export interface UpdateShiftInput {
  date?: string;
  startTime?: string;
  endTime?: string;
  workplaceId?: number;
  break?: number;
}

export const shiftService = {
  async list(auth: AuthPayload, month?: string, userId?: number) {
    const rows = await shiftRepository.findAll({
      ...owner(auth),
      ...(auth.role === "admin" && userId ? { userId } : {}),
      month,
    });
    return rows.map(toView);
  },

  async get(auth: AuthPayload, id: number) {
    const s = await shiftRepository.findOne({ id, ...owner(auth) });
    if (!s) throw notFound();
    return s;
  },

  async create(auth: AuthPayload, input: CreateShiftInput) {
    const userId = auth.role === "admin" ? input.userId : auth.id;
    if (!userId) throw new AppError(400, "userId required");
    const wp = await findWorkplace(input.workplaceId, userId);
    const rows = [...new Set(input.dates)].map((date) => ({
      userId,
      ...build(date, input.startTime, input.endTime, input.break, Number(wp.wage), wp.id),
    }));
    return (await shiftRepository.createMany(rows)).map(toView);
  },

  async update(auth: AuthPayload, id: number, input: UpdateShiftInput) {
    const cur = await this.get(auth, id);
    const wp = await findWorkplace(input.workplaceId ?? cur.workplaceId, cur.userId);
    const data = build(
      input.date ?? dateToLocalDate(cur.timeStart),
      input.startTime ?? dateToLocalTime(cur.timeStart),
      input.endTime ?? dateToLocalTime(cur.timeEnd),
      input.break ?? Number(cur.break),
      Number(wp.wage),
      wp.id,
    );
    return toView(await shiftRepository.update(id, data));
  },

  async remove(auth: AuthPayload, id: number) {
    await this.get(auth, id);
    await shiftRepository.delete(id);
  },
};
