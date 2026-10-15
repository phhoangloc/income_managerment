import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

// Noto Sans JP covers Japanese, Latin and Vietnamese glyphs
const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "収入管理",
  description: "シフトと収入を管理するアプリ",
  appleWebApp: { capable: true, title: "収入管理", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
