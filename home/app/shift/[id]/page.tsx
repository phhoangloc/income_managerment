"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import ShiftForm from "@/components/ShiftForm";
import { btnDanger, pageTitle } from "@/components/ui";
import { api, Shift, yen } from "@/lib/api";

function Content() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [shift, setShift] = useState<Shift | null>(null);

  useEffect(() => {
    api<Shift>(`/shifts/${id}`).then(setShift);
  }, [id]);

  async function remove() {
    if (!confirm("このシフトを削除しますか？")) return;
    await api(`/shifts/${id}`, { method: "DELETE" });
    router.push("/");
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">シフト編集</h1>
        <button onClick={remove} className={btnDanger}>削除</button>
      </div>
      {shift && (
        <>
          <p className="mb-4 text-sm text-gray-600">
            {shift.workingHours} 時間 · {yen(shift.dailyIncome)}
          </p>
          <ShiftForm
            multi={false}
            hidePicker
            initial={shift}
            onSubmit={async (v) => {
              await api(`/shifts/${id}`, {
                method: "PUT",
                body: JSON.stringify({ ...v, date: v.dates[0], dates: undefined }),
              });
              router.push("/");
            }}
          />
        </>
      )}
    </>
  );
}

export default function EditShiftPage() {
  return (
    <AppShell>
      <Content />
    </AppShell>
  );
}
