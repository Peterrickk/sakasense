"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function AuthForm({
  mode,
  googleEnabled,
}: {
  mode: "login" | "register";
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(undefined);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "");
    const password = String(f.get("password") ?? "");
    const res =
      mode === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(f.get("name") ?? "") });
    setPending(false);
    if (res.error) {
      setError(res.error.message ?? "Something went wrong. Please try again.");
      return;
    }
    if (mode === "register") toast.success("Account created. Check your email to verify it.");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {mode === "register" ? (
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" autoComplete="name" required />
          </div>
        ) : null}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
            required
          />
          {mode === "register" ? (
            <p className="text-text-muted mt-1 text-xs">At least 8 characters.</p>
          ) : null}
        </div>
        {error ? (
          <p role="alert" className="text-danger text-sm">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>
      {googleEnabled ? (
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/account" })}
        >
          Continue with Google
        </Button>
      ) : null}
      <p className="text-text-muted text-center text-sm">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link className="text-primary underline" href="/register">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link className="text-primary underline" href="/login">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
