import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "customer" | "admin";
};

/** The signed-in user, or null (also null when auth is not configured). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  // Always read request headers first so any page using this is rendered per-request, never prerendered.
  const h = await headers();
  const auth = getAuth();
  if (!auth) return null;
  try {
    const session = await auth.api.getSession({ headers: h });
    if (!session) return null;
    const u = session.user as typeof session.user & { role?: string };
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: u.emailVerified,
      role: u.role === "admin" ? "admin" : "customer",
    };
  } catch {
    return null;
  }
}

/** For pages: redirects to /login when signed out. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** For admin pages: non-admins get a 404 so the area's existence is not revealed. */
export async function requireAdminPage(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") notFound();
  return user;
}

/** For server actions: throws instead of redirecting. Call this at the top of EVERY admin action. */
export async function assertAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Forbidden");
  return user;
}
