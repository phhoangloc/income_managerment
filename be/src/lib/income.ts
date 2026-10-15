import { config } from "./config";

const HOUR = 3_600_000;
const MIN = 60_000;
const DAY = 24 * HOUR;
const NIGHT_START = 22 * HOUR; // from local midnight
const NIGHT_END = 5 * HOUR;
const NIGHT_RATE = 0.25;

/** Build a Date from a local date "YYYY-MM-DD" + "HH:mm" in the configured timezone. */
export function localToDate(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - config.tzOffsetMinutes * MIN);
}

const shifted = (d: Date) => new Date(d.getTime() + config.tzOffsetMinutes * MIN).toISOString();

export const dateToLocalDate = (d: Date) => shifted(d).slice(0, 10);
export const dateToLocalTime = (d: Date) => shifted(d).slice(11, 16);

/** Hours of [start, end) that fall inside the 22:00-05:00 local window. */
export function nightHours(start: Date, end: Date): number {
  const s = start.getTime() + config.tzOffsetMinutes * MIN;
  const e = end.getTime() + config.tzOffsetMinutes * MIN;
  let total = 0;
  for (let day = Math.floor(s / DAY) * DAY; day <= e; day += DAY) {
    const windows: [number, number][] = [
      [day, day + NIGHT_END],
      [day + NIGHT_START, day + DAY],
    ];
    for (const [ws, we] of windows) {
      total += Math.max(0, Math.min(e, we) - Math.max(s, ws));
    }
  }
  return total / HOUR;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** working_hours = end - break - start; night hours (22:00-05:00) earn +25%. */
export function calcShift(start: Date, end: Date, breakHours: number, wage: number) {
  const gross = (end.getTime() - start.getTime()) / HOUR;
  const workingHours = Math.max(0, gross - breakHours);
  const night = Math.min(nightHours(start, end), workingHours);
  const income = workingHours * wage + night * wage * NIGHT_RATE;
  return { workingHours: round2(workingHours), dailyIncome: round2(income) };
}
