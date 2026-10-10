import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/account/auth-form";
import { GlassCard } from "@/components/ui/glass-card";
import { getAuth } from "@/lib/auth";
import { getEnv } from "@/lib/env";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/account");
  const env = getEnv();
  return (
    <div className="container-page max-w-md py-16">
      <h1 className="text-h2 mb-6 text-center">Create your account</h1>
      <GlassCard className="p-6 md:p-8">
        {getAuth() ? (
          <AuthForm mode="register" googleEnabled={Boolean(env.GOOGLE_CLIENT_ID)} />
        ) : (
          <p className="text-text-muted">Accounts are not available right now.</p>
        )}
      </GlassCard>
    </div>
  );
}
