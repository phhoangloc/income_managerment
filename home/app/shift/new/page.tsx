"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import ShiftForm from "@/components/ShiftForm";
import { pageTitle } from "@/components/ui";
import { api } from "@/lib/api";

function NewShift() {
  const router = useRouter();
  const date = useSearchParams().get("date");
  return (
    <ShiftForm
      multi
      hidePicker={!!date}
      initial={date ? { dates: [date] } : undefined}
      onSubmit={async (v) => {
        await api("/shifts", { method: "POST", body: JSON.stringify(v) });
        router.push("/");
      }}
    />
  );
}

export default function NewShiftPage() {
  return (
    <AppShell>
      <h1 className={pageTitle}>シフト作成</h1>
      <Suspense>
        <NewShift />
      </Suspense>
    </AppShell>
  );
}
