const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface Workplace {
  id: number;
  name: string;
  wage: string;
}

export interface Shift {
  id: number;
  workplaceId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  break: number;
  workingHours: number;
  dailyIncome: number;
}

const ERRORS: Record<string, string> = {
  "Wrong username or password": "ユーザー名またはパスワードが違います",
  "Invalid input": "入力内容が正しくありません",
  "Workplace not found": "勤務先が見つかりません",
  "Already exists": "すでに存在します",
  "Not found": "見つかりません",
  Unauthorized: "ログインが必要です",
  "Internal server error": "サーバーエラーが発生しました",
  "Google login is not configured": "Googleログインは設定されていません",
  "Invalid Google token": "Googleトークンが無効です",
  "Google account has no verified email": "Googleアカウントのメールが未確認です",
};

export const getToken = () => localStorage.getItem("token");
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? getToken() : null;
  const res = await fetch(API + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (res.status === 401 && path !== "/auth/login") return logout() as never;
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = data?.error;
    throw new Error(typeof e === "string" ? (ERRORS[e] ?? e) : "リクエストに失敗しました");
  }
  return data as T;
}

export const yen = (n: number) =>
  new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 }).format(n);

export const pad = (n: number) => String(n).padStart(2, "0");
export const monthKey = (y: number, m: number) => `${y}-${pad(m + 1)}`; // m is 0-based
export const dateKey = (y: number, m: number, d: number) => `${monthKey(y, m)}-${pad(d)}`;

/** "20:00" -> "20", "09:30" -> "9:30" */
export const shortTime = (t: string) => {
  const [h, m] = t.split(":");
  return m === "00" ? String(Number(h)) : `${Number(h)}:${m}`;
};
