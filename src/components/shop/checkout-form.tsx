"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EmptyState } from "@/components/brand/misc";
import { CartLineThumb } from "@/components/product/cart-line-thumb";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { formatPHP } from "@/lib/money";
import { computeTotals, type ShippingMethod } from "@/lib/pricing";
import { checkoutFormSchema, type CheckoutFormInput } from "@/lib/validators";
import { createOrder } from "@/server/actions/checkout";
import { selectSubtotal, useCart } from "@/store/cart";
import { useCartReady } from "@/store/use-cart-hydrated";

type Prefill = { email?: string; name?: string };

const PAYMENT_OPTIONS = [
  { value: "gcash", label: "GCash" },
  { value: "maya", label: "Maya" },
  { value: "card", label: "Credit / debit card" },
  ...(siteConfig.features.stripe
    ? [{ value: "stripe", label: "International card (Stripe)" }]
    : []),
  ...(siteConfig.cod.enabled ? [{ value: "cod", label: "Cash on delivery" }] : []),
] as const;

export function CheckoutForm({ prefill }: { prefill?: Prefill }) {
  const ready = useCartReady();
  const items = useCart((s) => s.items);
  const [pending, startTransition] = useTransition();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: prefill?.email ?? "",
      shippingMethod: "standard",
      paymentMethod: "gcash",
      address: { fullName: prefill?.name ?? "", country: "PH" },
    },
  });

  const shippingMethod = useWatch({ control, name: "shippingMethod" }) as ShippingMethod;
  const lines = items.map((i) => ({
    ...i,
    lineTotalCentavos: i.unitPriceCentavos * i.quantity,
  }));
  const totals = computeTotals(lines, shippingMethod);
  const subtotal = selectSubtotal({ items });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cancelled")) {
      toast.info("Payment was cancelled. Your cart is still here.");
    }
  }, []);

  if (!ready) return <Skeleton className="h-96 w-full" />;
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        action={<Button href="/products">Browse products</Button>}
      />
    );
  }

  const onSubmit = handleSubmit((values) => {
    track("begin_checkout", { value: subtotal });
    startTransition(async () => {
      const result = await createOrder({
        ...values,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      if (result.ok) {
        window.location.assign(result.url);
        return;
      }
      if (result.errors) {
        for (const [path, message] of Object.entries(result.errors)) {
          setError(path as keyof CheckoutFormInput, { message });
        }
      }
      toast.error(result.message ?? "Please check the highlighted fields.");
    });
  });

  const a = errors.address;
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-6">
        <GlassCard className="space-y-4">
          <h2 className="text-h3">1. Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>
          {!prefill?.email ? (
            <p className="text-text-muted text-sm">
              Have an account?{" "}
              <Link className="text-primary underline" href="/login">
                Log in
              </Link>{" "}
              for faster checkout, or continue as a guest.
            </p>
          ) : null}
        </GlassCard>

        <GlassCard className="space-y-4">
          <h2 className="text-h3">2. Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                autoComplete="name"
                aria-invalid={!!a?.fullName}
                {...register("address.fullName")}
              />
              <FieldError message={a?.fullName?.message} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="line1">Street address</Label>
              <Input
                id="line1"
                autoComplete="address-line1"
                aria-invalid={!!a?.line1}
                {...register("address.line1")}
              />
              <FieldError message={a?.line1?.message} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="line2">Unit / building (optional)</Label>
              <Input id="line2" autoComplete="address-line2" {...register("address.line2")} />
            </div>
            <div>
              <Label htmlFor="barangay">Barangay</Label>
              <Input id="barangay" aria-invalid={!!a?.barangay} {...register("address.barangay")} />
              <FieldError message={a?.barangay?.message} />
            </div>
            <div>
              <Label htmlFor="city">City / municipality</Label>
              <Input
                id="city"
                autoComplete="address-level2"
                aria-invalid={!!a?.city}
                {...register("address.city")}
              />
              <FieldError message={a?.city?.message} />
            </div>
            <div>
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                autoComplete="address-level1"
                aria-invalid={!!a?.province}
                {...register("address.province")}
              />
              <FieldError message={a?.province?.message} />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Input id="region" aria-invalid={!!a?.region} {...register("address.region")} />
              <FieldError message={a?.region?.message} />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal code</Label>
              <Input
                id="postalCode"
                inputMode="numeric"
                autoComplete="postal-code"
                aria-invalid={!!a?.postalCode}
                {...register("address.postalCode")}
              />
              <FieldError message={a?.postalCode?.message} />
            </div>
            <div>
              <Label htmlFor="addrPhone">Recipient phone</Label>
              <Input
                id="addrPhone"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!a?.phone}
                {...register("address.phone")}
              />
              <FieldError message={a?.phone?.message} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-3">
          <h2 className="text-h3">3. Shipping method</h2>
          {(
            [
              ["standard", "Standard", "3–7 business days [PLACEHOLDER]"],
              ["express", "Express", "1–3 business days [PLACEHOLDER]"],
            ] as const
          ).map(([value, label, eta]) => (
            <label
              key={value}
              className="border-border has-[:checked]:border-primary flex cursor-pointer items-center gap-3 rounded-xl border p-4"
            >
              <input
                type="radio"
                value={value}
                className="accent-primary size-4"
                {...register("shippingMethod")}
              />
              <span className="flex-1">
                <span className="block font-medium">{label}</span>
                <span className="text-text-muted block text-sm">
                  {eta.replace(" [PLACEHOLDER]", "")}
                </span>
              </span>
              <span className="font-display font-bold">
                {computeTotals(lines, value).shippingCentavos === 0
                  ? "Free"
                  : formatPHP(computeTotals(lines, value).shippingCentavos)}
              </span>
            </label>
          ))}
        </GlassCard>

        <GlassCard className="space-y-3">
          <h2 className="text-h3">4. Payment</h2>
          <Label htmlFor="paymentMethod" className="sr-only">
            Payment method
          </Label>
          <Select id="paymentMethod" {...register("paymentMethod")}>
            {PAYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <p className="text-text-muted text-sm">
            You&apos;ll be redirected to complete payment securely.
          </p>
          <div>
            <Label htmlFor="notes">Order notes (optional)</Label>
            <Textarea id="notes" className="min-h-20" {...register("notes")} />
          </div>
        </GlassCard>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <GlassCard className="space-y-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left lg:pointer-events-none"
            aria-expanded={summaryOpen}
            onClick={() => setSummaryOpen((o) => !o)}
          >
            <h2 className="text-h3">Order summary</h2>
            <span className="text-primary text-sm lg:hidden">{summaryOpen ? "Hide" : "Show"}</span>
          </button>
          <ul className={`space-y-3 ${summaryOpen ? "" : "hidden"} lg:block`}>
            {items.map((i) => (
              <li key={i.productId} className="flex gap-3">
                <CartLineThumb image={i.image} name={i.name} />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-text-muted">Qty {i.quantity}</p>
                </div>
                <span className="text-sm">{formatPHP(i.unitPriceCentavos * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="border-border space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Subtotal</dt>
              <dd>{formatPHP(totals.subtotalCentavos)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Shipping</dt>
              <dd>{totals.shippingCentavos === 0 ? "Free" : formatPHP(totals.shippingCentavos)}</dd>
            </div>
            <div className="flex justify-between text-lg">
              <dt>Total</dt>
              <dd className="font-display font-bold">{formatPHP(totals.totalCentavos)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Starting payment…" : "Pay now"}
          </Button>
          <p className="text-text-muted text-xs">
            Final amount is confirmed by our server at payment. By ordering you agree to our{" "}
            <Link className="underline" href="/legal/terms">
              Terms
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/legal/shipping-returns">
              Shipping &amp; Returns
            </Link>
            .
          </p>
        </GlassCard>
      </aside>
    </form>
  );
}
