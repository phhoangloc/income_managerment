"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { btnDanger, btnPrimary, btnSoft, card, cardPad, input, pageTitle, td, th } from "@/components/ui";
import { api, Workplace, yen } from "@/lib/api";

export default function WorkplacePage() {
  const [list, setList] = useState<Workplace[]>([]);
  const [name, setName] = useState("");
  const [wage, setWage] = useState("");
  const [error, setError] = useState("");

  const load = () => api<Workplace[]>("/workplaces").then(setList);
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/workplaces", { method: "POST", body: JSON.stringify({ name, wage: Number(wage) }) });
      setName("");
      setWage("");
      setError("");
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function edit(w: Workplace) {
    const n = prompt("名前", w.name);
    const wg = prompt("時給", String(Number(w.wage)));
    if (!n || wg === null) return;
    await api(`/workplaces/${w.id}`, { method: "PUT", body: JSON.stringify({ name: n, wage: Number(wg) }) });
    load();
  }

  async function remove(w: Workplace) {
    if (!confirm(`「${w.name}」とそのシフトをすべて削除しますか？`)) return;
    await api(`/workplaces/${w.id}`, { method: "DELETE" });
    load();
  }

  return (
    <AppShell>
      <h1 className={pageTitle}>勤務先</h1>
      <form onSubmit={add} className={`${cardPad} mb-4 flex flex-wrap items-center gap-2`}>
        <input required className={input} placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
        <input required type="number" min="0" className={input} placeholder="時給" value={wage} onChange={(e) => setWage(e.target.value)} />
        <button className={btnPrimary}>追加</button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </form>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-max whitespace-nowrap text-left text-sm">
          <thead>
            <tr>
              <th className={th}>名前</th>
              <th className={`${th} text-right`}>時給</th>
              <th className={th} />
            </tr>
          </thead>
          <tbody>
            {list.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className={`${td} font-medium`}>{w.name}</td>
                <td className={`${td} text-right`}>{yen(Number(w.wage))}</td>
                <td className={`${td} flex justify-end gap-2`}>
                  <button onClick={() => edit(w)} className={btnSoft}>編集</button>
                  <button onClick={() => remove(w)} className={btnDanger}>削除</button>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">勤務先はまだありません</td></tr>}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
