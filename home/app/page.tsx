"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import MonthNav from "@/components/MonthNav";
import { btnPrimary } from "@/components/ui";
import { api, dateKey, monthKey, shortTime, Shift, Workplace } from "@/lib/api";

const WEEK = ["月", "火", "水", "木", "金", "土", "日"];

// One accent colour per workplace (full class names so Tailwind can see them)
const ACCENTS = ["bg-violet-400", "bg-orange-400", "bg-green-500", "bg-blue-600", "bg-pink-400", "bg-teal-400"];

function Content() {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  useEffect(() => {
    api<Workplace[]>("/workplaces").then(setWorkplaces);
  }, []);
  useEffect(() => {
    api<Shift[]>(`/shifts?month=${monthKey(ym.y, ym.m)}`).then(setShifts);
  }, [ym]);

  const wpName = (id: number) => workplaces.find((w) => w.id === id)?.name ?? "";
  const accent = (id: number) => ACCENTS[Math.max(0, workplaces.findIndex((w) => w.id === id)) % ACCENTS.length];
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();
  const offset = (new Date(ym.y, ym.m, 1).getDay() + 6) % 7;
  const today = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <MonthNav
          year={ym.y}
          month={ym.m}
          onChange={(y, m) => setYm({ y, m })}
        />
        <Link
          href="/shift/new"
          className={btnPrimary}
        >
          + シフト作成
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="grid grid-cols-7">
          {WEEK.map((w) => (
            <div key={w} className="border-b border-r border-gray-100 bg-blue-50/70 px-3 py-3 text-xs font-medium text-gray-500 max-[574px]:px-1.5">
              {w}
            </div>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <div key={"o" + i} className="border-b border-r border-gray-100 bg-gray-50/60" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const k = dateKey(ym.y, ym.m, i + 1);
            const day = shifts.filter((s) => s.date === k);
            return (
              <div
                key={k}
                className={`min-h-28 border-b border-r border-gray-100 p-2 text-xs max-[574px]:p-1 max-[574px]:text-[10px] ${day.length ? "bg-blue-50/70" : ""}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 font-medium ${k === today ? "bg-blue-600 text-white" : "text-gray-500"}`}
                  >
                    {i + 1}
                  </span>
                  <Link
                      href={`/shift/new?date=${k}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-base font-semibold leading-none text-blue-600 bg-blue-100 hover:bg-blue-600 hover:text-white"
                    >
                      +
                    </Link>
                </div>
                {day.map((s) => (
                  <Link
                    key={s.id}
                    href={`/shift/${s.id}`}
                    className="mb-1.5 block rounded-lg border border-gray-100 bg-white p-2 shadow-md transition hover:shadow-lg max-[574px]:p-1"
                  >
                    <div className={`mb-1.5 h-1 w-6 rounded-full ${accent(s.workplaceId)}`} />
                    <div className="font-semibold text-gray-900">
                      <span className="hidden min-[575px]:inline">{s.startTime}–{s.endTime}</span>
                      <span className="min-[575px]:hidden">{shortTime(s.startTime)}–{shortTime(s.endTime)}</span>
                    </div>
                    <div className="truncate text-gray-500">
                      <span className="hidden min-[575px]:inline">{wpName(s.workplaceId)}</span>
                      <span className="min-[575px]:hidden">{wpName(s.workplaceId).charAt(0)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <AppShell>
      <Content />
    </AppShell>
  );
}
