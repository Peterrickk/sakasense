"use client";

import { BrandMark } from "@/components/Brand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { DEMO_PASSWORD, DEMO_USER } from "@/lib/data";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_USER.email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await login(email, password);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Login failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="sakasense-grain flex min-h-screen items-center justify-center px-4 py-10">
      <div className="sakasense-card w-full max-w-md p-8">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <BrandMark />
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-sakasense-green-dark">
            SakaSense
          </span>
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-sakasense-muted">
          Demo: {DEMO_USER.email} / {DEMO_PASSWORD}
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-sakasense-border bg-sakasense-surface-2 px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-sakasense-border bg-sakasense-surface-2 px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
            />
          </label>
          {error ? <p className="text-sm text-sakasense-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-sakasense-green py-3 text-sm font-semibold text-sakasense-on-green hover:bg-sakasense-green-dark disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-sakasense-muted">
          New here?{" "}
          <Link href="/register" className="font-semibold text-sakasense-green">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
