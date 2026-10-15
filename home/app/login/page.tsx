"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { btnPrimary, cardPad, input } from "@/components/ui";
import { api } from "@/lib/api";

declare global {
  interface Window {
    // Google Identity Services (loaded from accounts.google.com)
    google?: {
      accounts: {
        id: {
          initialize: (o: { client_id: string; callback: (r: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const googleBtn = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);

  async function finish(path: string, body: object) {
    try {
      const r = await api<{ token: string }>(path, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("token", r.token);
      router.replace("/");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  // Google sign-in: the client id comes from the backend .env (GOOGLE_CLIENT_ID)
  useEffect(() => {
    let cancelled = false;
    api<{ clientId: string }>("/auth/google/config")
      .then(({ clientId }) => {
        if (!clientId || cancelled) return;
        const init = () => {
          if (cancelled || !googleBtn.current) return;
          window.google!.accounts.id.initialize({
            client_id: clientId,
            callback: (r: { credential: string }) => finish("/auth/google", { credential: r.credential }),
          });
          window.google!.accounts.id.renderButton(googleBtn.current, { theme: "outline", size: "large", width: 288, locale: "ja" });
          setGoogleReady(true);
        };
        if (window.google) return init();
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = init;
        document.head.appendChild(script);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    return finish("/auth/login", { username, password });
  }

  return (
    <form onSubmit={submit} className={`${cardPad} mx-auto mt-24 w-80 space-y-3`}>
      <h1 className="text-xl font-semibold">ログイン</h1>
      <input className={`${input} w-full`} placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className={`${input} w-full`} type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className={`${btnPrimary} w-full`}>ログイン</button>
      <div className={googleReady ? "space-y-3" : "hidden"}>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />または<span className="h-px flex-1 bg-gray-200" />
        </div>
        <div ref={googleBtn} className="flex justify-center" />
      </div>
    </form>
  );
}
