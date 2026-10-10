"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { trackOrder, type TrackState } from "@/server/actions/track-order";
import { OrderTimeline } from "./order-timeline";

const initial: TrackState = { ok: false };

export function TrackForm() {
  const [state, action, pending] = useActionState(trackOrder, initial);
  const err = state.errors ?? {};
  return (
    <div className="space-y-8">
      <GlassCard>
        <form
          action={action}
          noValidate
          className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        >
          <div>
            <Label htmlFor="orderNumber">Order number</Label>
            <Input
              id="orderNumber"
              name="orderNumber"
              placeholder="SKS-2026-000123"
              autoComplete="off"
              aria-invalid={!!err.orderNumber}
            />
            <FieldError message={err.orderNumber} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!err.email}
            />
            <FieldError message={err.email} />
          </div>
          <Button type="submit" className="h-12" disabled={pending}>
            {pending ? "Looking…" : "Track order"}
          </Button>
        </form>
        {state.message && !state.ok ? (
          <p role="alert" className="text-danger mt-4 text-sm">
            {state.message}
          </p>
        ) : null}
      </GlassCard>

      {state.ok && state.order ? (
        <GlassCard className="space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-h3 font-mono">{state.order.orderNumber}</h2>
            <time dateTime={state.order.createdAt} className="text-text-muted text-sm">
              Placed{" "}
              {new Date(state.order.createdAt).toLocaleDateString("en-PH", { dateStyle: "long" })}
            </time>
          </div>
          <OrderTimeline status={state.order.status} />
          {state.order.courier || state.order.trackingNumber ? (
            <p className="text-sm">
              {state.order.courier ? (
                <>
                  Courier: <strong>{state.order.courier}</strong>.{" "}
                </>
              ) : null}
              {state.order.trackingNumber ? (
                <>
                  Tracking number:{" "}
                  <strong className="font-mono">{state.order.trackingNumber}</strong>
                </>
              ) : null}
            </p>
          ) : null}
          <ul className="text-text-muted text-sm">
            {state.order.items.map((i) => (
              <li key={i.name}>
                {i.quantity} × {i.name}
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}
    </div>
  );
}
