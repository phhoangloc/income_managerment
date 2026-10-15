"use client";

export default function MonthNav({
  year,
  month,
  onChange,
  onToday,
}: {
  year: number;
  month: number; // 0-based
  onChange: (y: number, m: number) => void;
  onToday?: () => void;
}) {
  const go = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    onChange(d.getFullYear(), d.getMonth());
  };
  const btn = "flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-blue-50 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 active:scale-95";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} onClick={() => go(-1)} title="前の月" aria-label="前の月">‹</button>
      <span className="min-w-24 text-center text-sm font-semibold">
        {year}年{month + 1}月
      </span>
      <button type="button" className={btn} onClick={() => go(1)} title="次の月" aria-label="次の月">›</button>
      {onToday && (
        <button
          type="button"
          onClick={onToday}
          className="h-8 rounded-md border border-blue-200 bg-blue-50 px-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 active:scale-95"
        >
          今日
        </button>
      )}
    </div>
  );
}
