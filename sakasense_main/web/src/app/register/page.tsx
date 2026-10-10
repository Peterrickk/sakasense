"use client";

import { BrandMark } from "@/components/Brand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    await register(name, email, password);
    setBusy(false);
    router.push("/onboarding");
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
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-sakasense-muted">
          Same account works with the SakaSense mobile app (shared backend).
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Full name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-sakasense-border bg-sakasense-surface-2 px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
            />
          </label>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-sakasense-border bg-sakasense-surface-2 px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-sakasense-green py-3 text-sm font-semibold text-sakasense-on-green hover:bg-sakasense-green-dark disabled:opacity-60"
          >
            {busy ? "Creating…" : "Continue to device linking"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-sakasense-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-sakasense-green">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
