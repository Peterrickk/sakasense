"use client";
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { addAddress } from "@/server/actions/account";
import type { FormState } from "@/server/form-state";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}

const initial: FormState = { ok: false };

export function AddressForm() {
  const [state, action, pending] = useActionState(addAddress, initial);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      ref.current?.reset();
    } else toast.error(state.message);
  }, [state]);
  const err = state.errors ?? {};
  const fields: [string, string, string?][] = [
    ["fullName", "Full name"],
    ["phone", "Phone"],
    ["line1", "Street address"],
    ["line2", "Unit / building (optional)"],
    ["barangay", "Barangay"],
    ["city", "City / municipality"],
    ["province", "Province"],
    ["region", "Region"],
    ["postalCode", "Postal code"],
  ];
  return (
    <form ref={ref} action={action} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map(([name, label]) => (
        <div key={name}>
          <Label htmlFor={`addr-${name}`}>{label}</Label>
          <Input id={`addr-${name}`} name={name} aria-invalid={!!err[name]} />
          <FieldError message={err[name]} />
        </div>
      ))}
      <input type="hidden" name="country" value="PH" />
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save address"}
        </Button>
      </div>
    </form>
  );
}
