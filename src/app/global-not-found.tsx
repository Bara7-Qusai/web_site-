import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — الكنوز للحلول الزراعية · Al-Kunooz Agricultural Solutions",
};

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-dvh items-center justify-center bg-forest-800 p-6 text-center text-white">
        <main>
          <p className="ltr-num text-7xl font-bold text-leaf-400">404</p>
          <h1 className="mt-4 text-2xl font-bold">الصفحة غير موجودة</h1>
          <p className="mt-1 text-white/70" lang="en" dir="ltr">Page not found</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/ar" className="btn btn-leaf">الرئيسية</Link>
            <Link href="/en" className="btn btn-ghost-light" lang="en">Home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
