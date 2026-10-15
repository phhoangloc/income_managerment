"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MonthNav from "@/components/MonthNav";
import { btnPrimary, cardPad, input } from "@/components/ui";
import { api, dateKey, Shift, Workplace } from "@/lib/api";

const BREAKS = [0, 0.25, 0.5, 0.75];
const WEEK = ["月", "火", "水", "木", "金", "土", "日"];

export interface ShiftFormValue {
  dates: string[];
  startTime: string;
  endTime: string;
  workplaceId: number;
  break: number;
}

/** Create (multi-date picker) or edit (single date) form. */
export default function ShiftForm({
  initial,
  multi,
  hidePicker,
  onSubmit,
}: {
  initial?: Partial<Shift> & { dates?: string[] };
  multi: boolean;
  hidePicker?: boolean; // date already chosen on the calendar
  onSubmit: (v: ShiftFormValue) => Promise<void>;
}) {
  const now = new Date();
  const first = initial?.dates?.[0] ?? initial?.date;
  const [view, setView] = useState(
    first ? { y: +first.slice(0, 4), m: +first.slice(5, 7) - 1 } : { y: now.getFullYear(), m: now.getMonth() },
  );
  const [dates, setDates] = useState<string[]>(initial?.dates ?? (initial?.date ? [initial.date] : []));
  const [startTime, setStartTime] = useState(initial?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "17:00");
  const [breakH, setBreakH] = useState(initial?.break ?? 0);
  const [workplaceId, setWorkplaceId] = useState<number | "">(initial?.workplaceId ?? "");
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Workplace[]>("/workplaces").then((w) => {
      setWorkplaces(w);
      setLoaded(true);
      setWorkplaceId((cur) => cur || w[0]?.id || "");
    });
  }, []);

  const toggle = (k: string) =>
    setDates((d) => (multi ? (d.includes(k) ? d.filter((x) => x !== k) : [...d, k].sort()) : [k]));

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Monday first

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dates.length) return setError("日付を1日以上選択してください");
    if (!workplaces.length || !workplaceId) return setError("勤務先を選択してください");
    setBusy(true);
    setError("");
    try {
      await onSubmit({ dates, startTime, endTime, workplaceId: Number(workplaceId), break: breakH });
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={`${cardPad} space-y-4`}>
      {hidePicker ? (
        <p className="text-sm text-gray-600">日付: <span className="font-medium text-gray-900">{dates.join(", ")}</span></p>
      ) : (
      <div>
        <div className="mb-2 flex items-center gap-2">
          <MonthNav
            year={view.y}
            month={view.m}
            onChange={(y, m) => setView({ y, m })}
          />
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {WEEK.map((w) => <div key={w} className="rounded bg-blue-50/70 py-1 text-xs font-medium text-gray-500">{w}</div>)}
          {Array.from({ length: offset }, (_, i) => <div key={"o" + i} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const k = dateKey(view.y, view.m, i + 1);
            const on = dates.includes(k);
            return (
              <button type="button" key={k} onClick={() => toggle(k)}
                className={`rounded-md border border-gray-100 py-2 ${on ? "bg-blue-50" : "hover:bg-blue-50"}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
      )}

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col text-sm">開始
          <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={input} />
        </label>
        <label className="flex flex-col text-sm">終了
          <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={input} />
        </label>
        <label className="flex flex-col text-sm">休憩（時間）
          <select value={breakH} onChange={(e) => setBreakH(Number(e.target.value))} className={input}>
            {BREAKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="flex flex-col text-sm">勤務先
          <select value={workplaceId} onChange={(e) => setWorkplaceId(Number(e.target.value))} className={input}>
            {workplaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </label>
      </div>
      {loaded && !workplaces.length && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">勤務先がありません。<Link href="/workplace" className="underline">作成する</Link></p>
      )}
      <p className="text-xs text-gray-500">終了時刻が開始時刻より前の場合は翌日終了として扱います。22:00〜5:00は25%増になります。</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={busy || !workplaces.length} className={btnPrimary}>保存</button>
    </form>
  );
}
