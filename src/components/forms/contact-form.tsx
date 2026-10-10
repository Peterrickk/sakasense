"use client";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { contactTopics } from "@/lib/validators";
import { submitContact } from "@/server/actions/inquiries";
import type { FormState } from "@/server/form-state";

const initial: FormState = { ok: false };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      ref.current?.reset();
    } else toast.error(state.message);
  }, [state]);

  const err = state.errors ?? {};
  return (
    <form ref={ref} action={action} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
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
          <Label htmlFor="topic">Topic</Label>
          <Select id="topic" name="topic" defaultValue="" required aria-invalid={!!err.topic}>
            <option value="" disabled>
              Choose a topic
            </option>
            {contactTopics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <FieldError message={err.topic} />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required aria-invalid={!!err.message} />
        <FieldError message={err.message} />
      </div>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
