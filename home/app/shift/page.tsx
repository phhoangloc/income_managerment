"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import MonthNav from "@/components/MonthNav";
import { btnPrimary, card, input, td, th } from "@/components/ui";
import { api, monthKey, Shift, Workplace, yen } from "@/lib/api";

function Content() {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [allShifts, setShifts] = useState<Shift[]>([]);
  const [workplaceId, setWorkplaceId] = useState(0); // 0 = all
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  useEffect(() => {
    api<Workplace[]>("/workplaces").then(setWorkplaces);
  }, []);
  useEffect(() => {
    api<Shift[]>(`/shifts?month=${monthKey(ym.y, ym.m)}`).then(setShifts);
  }, [ym]);

  const wpName = (id: number) => workplaces.find((w) => w.id === id)?.name ?? "-";
  const shifts = workplaceId ? allShifts.filter((s) => s.workplaceId === workplaceId) : allShifts;
  const total = shifts.reduce((s, x) => s + x.dailyIncome, 0);
  const hours = shifts.reduce((s, x) => s + x.workingHours, 0);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <MonthNav
          year={ym.y}
          month={ym.m}
          onChange={(y, m) => setYm({ y, m })}
        />
        <select value={workplaceId} onChange={(e) => setWorkplaceId(Number(e.target.value))} className={input}>
          <option value={0}>すべての勤務先</option>
          {workplaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <Link href="/shift/new" className={btnPrimary}>+ シフト作成</Link>
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-max whitespace-nowrap text-left text-sm">
          <thead>
            <tr>
              <th className={th}>日付</th><th className={th}>時間</th><th className={th}>勤務先</th><th className={th}>休憩</th>
              <th className={`${th} text-right`}>勤務時間</th><th className={`${th} text-right`}>収入</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className={td}><Link href={`/shift/${s.id}`} className="font-medium text-blue-600 hover:underline">{s.date}</Link></td>
                <td className={td}>{s.startTime}–{s.endTime}</td>
                <td className={td}>{wpName(s.workplaceId)}</td>
                <td className={td}>{s.break}</td>
                <td className={`${td} text-right`}>{s.workingHours}</td>
                <td className={`${td} text-right`}>{yen(s.dailyIncome)}</td>
              </tr>
            ))}
            {!shifts.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">今月のシフトはありません</td></tr>}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50/70 font-semibold">
              <td className="px-4 py-3" colSpan={4}>収入合計</td>
              <td className="px-4 py-3 text-right">{Math.round(hours * 100) / 100}</td>
              <td className="px-4 py-3 text-right">{yen(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default function ShiftListPage() {
  return (
    <AppShell>
      <Content />
    </AppShell>
  );
}
