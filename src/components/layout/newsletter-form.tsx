"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/server/actions/newsletter";
import type { FormState } from "@/server/form-state";

const initial: FormState = { ok: false };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);

  useEffect(() => {
    if (state.message) (state.ok ? toast.success : toast.error)(state.message);
  }, [state]);

  return (
    <form action={action} className="max-w-xs space-y-2" noValidate>
      <label htmlFor="newsletter-email" className="text-sm font-medium">
        Get farm-tech news
      </label>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          aria-invalid={Boolean(state.errors?.email)}
        />
        {/* Honeypot: hidden from people, tempting to bots. */}
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <Button type="submit" size="sm" className="h-12" disabled={pending}>
          {pending ? "…" : "Join"}
        </Button>
      </div>
      {state.errors?.email ? (
        <p role="alert" className="text-danger text-sm">
          {state.errors.email}
        </p>
      ) : null}
    </form>
  );
}
