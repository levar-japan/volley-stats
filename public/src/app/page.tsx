"use client";

import { useEffect, useState } from "react";
import { ensureAnonymousSignIn, auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [ping, setPing] = useState<string>("(未実行)");

  useEffect(() => {
    // 匿名ログインを保証 → uid を取得
    ensureAnonymousSignIn().catch(console.error);
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const doPing = async () => {
    try {
      const res = await fetch("/api/ping", { cache: "no-store" });
      const data = await res.json();
      setPing(JSON.stringify(data));
    } catch (e) {
      setPing(String(e));
    }
  };

  return (
    <main className="max-w-sm mx-auto p-4 sm:max-w-md">
      <h1 className="text-2xl font-bold mb-4">volley-stats</h1>

      <section className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="font-semibold mb-2">匿名Auth 状態</h2>
        <p className="text-sm text-gray-600 break-all">
          {user ? <>✅ サインイン済み / <b>uid:</b> {user.uid}</> : "⏳ サインイン中..."}
        </p>
      </section>

      <section className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="font-semibold mb-2">API 動作確認</h2>
        <button
          onClick={doPing}
          className="w-full rounded-lg bg-black text-white py-3 text-base"
        >
          /api/ping を叩く
        </button>
        <pre className="mt-3 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{ping}
        </pre>
      </section>

      <p className="text-xs text-gray-500">
        スマホ幅で崩れない最小UI。Tailwind CSS 使用。
      </p>
    </main>
  );
}
