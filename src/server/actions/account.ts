"use server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { addresses } from "@/db/schema";
import { addressSchema, fieldErrors } from "@/lib/validators";
import { getCurrentUser } from "@/lib/session";
import type { FormState } from "@/server/form-state";

export async function addAddress(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Please log in." };
  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  await requireDb()
    .insert(addresses)
    .values({ ...parsed.data, userId: user.id });
  revalidatePath("/account");
  return { ok: true, message: "Address saved." };
}

export async function deleteAddress(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const id = String(formData.get("id") ?? "");
  // Scoped to the signed-in user so one customer can never delete another's address.
  await requireDb()
    .delete(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, user.id)));
  revalidatePath("/account");
}
