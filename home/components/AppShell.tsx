"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/api";
import { card } from "@/components/ui";

const LINKS = [
  { href: "/", label: "カレンダー" },
  { href: "/shift", label: "シフト" },
  { href: "/workplace", label: "勤務先" },
];

function NavLinks() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return LINKS.map((l) => (
    <Link
      key={l.href}
      href={l.href}
      className={`rounded-md px-3 py-1.5 font-medium ${active(l.href) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
    >
      {l.label}
    </Link>
  ));
}

/** Redirects to /login when there is no token, and renders the nav bar. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/login");
    else setReady(true);
  }, [router]);

  if (!ready) return null;
  return (
    <div className="w-full p-1">
      <nav className={`${card} mb-4 flex items-center gap-1 p-1.5 text-sm`}>
        <Suspense fallback={null}>
          <NavLinks />
        </Suspense>
        <button onClick={logout} className="ml-auto rounded-md px-3 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-black">
          ログアウト
        </button>
      </nav>
      {children}
    </div>
  );
}
