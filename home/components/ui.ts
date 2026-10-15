// Shared class names so every page looks the same as the calendar.
export const card = "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md";
export const cardPad = `${card} p-4`;
export const input =
  "h-9 rounded-md border border-gray-200 bg-white px-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const btnBase =
  "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition active:scale-95 disabled:opacity-50";
export const btnOutline = `${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
// main action: solid blue
export const btnPrimary = `${btnBase} bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 hover:shadow-lg`;
// secondary action (edit, nav): soft blue
export const btnSoft = `${btnBase} border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`;
// destructive action: soft red
export const btnDanger = `${btnBase} border border-red-200 bg-red-50 text-red-600 hover:bg-red-100`;
export const th = "border-b border-gray-100 bg-blue-50/70 px-4 py-3 text-xs font-medium text-gray-500";
export const td = "border-b border-gray-100 px-4 py-3";
export const pageTitle = "mb-4 text-lg font-semibold";
