"use client";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { track } from "@/lib/analytics";
import { orgTypes } from "@/lib/validators";
import { submitQuote } from "@/server/actions/inquiries";
import type { FormState } from "@/server/form-state";

const initial: FormState = { ok: false };

export function QuoteForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [state, action, pending] = useActionState(submitQuote, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      track("quote_submitted");
      ref.current?.reset();
    } else toast.error(state.message);
  }, [state]);

  const err = state.errors ?? {};
  return (
    <form ref={ref} action={action} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="organization">Organization name</Label>
          <Input
            id="organization"
            name="organization"
            autoComplete="organization"
            required
            aria-invalid={!!err.organization}
          />
          <FieldError message={err.organization} />
        </div>
        <div>
          <Label htmlFor="orgType">Organization type</Label>
          <Select id="orgType" name="orgType" defaultValue="" required aria-invalid={!!err.orgType}>
            <option value="" disabled>
              Choose a type
            </option>
            {orgTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <FieldError message={err.orgType} />
        </div>
        <div>
          <Label htmlFor="name">Contact person</Label>
          <Input id="name" name="name" autoComplete="name" required aria-invalid={!!err.name} />
          <FieldError message={err.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!err.email}
          />
          <FieldError message={err.email} />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!err.phone} />
          <FieldError message={err.phone} />
        </div>
        <div>
          <Label htmlFor="region">Region / province</Label>
          <Input id="region" name="region" required aria-invalid={!!err.region} />
          <FieldError message={err.region} />
        </div>
        <div>
          <Label htmlFor="units">Number of units</Label>
          <Input
            id="units"
            name="units"
            type="number"
            min={1}
            inputMode="numeric"
            required
            aria-invalid={!!err.units}
          />
          <FieldError message={err.units} />
        </div>
        <div>
          <Label htmlFor="hectares">Hectares (optional)</Label>
          <Input id="hectares" name="hectares" inputMode="decimal" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Anything else we should know?</Label>
        <Textarea id="message" name="message" defaultValue={defaultMessage} />
      </div>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Request quote"}
      </Button>
    </form>
  );
}
