"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { EcosystemLink } from "@/components/ecosystem/ecosystem-link";
import { StoreBadges } from "@/components/ecosystem/store-badges";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { formatPHP } from "@/lib/money";
import { useCart, type CartItem } from "@/store/cart";

/**
 * Shows the order number and a summary taken from the browser's own cart (no server lookup, so
 * order details are never exposed by URL), then clears the cart.
 */
export function SuccessView({ orderNumber }: { orderNumber: string }) {
  const [snapshot, setSnapshot] = useState<CartItem[]>([]);

  useEffect(() => {
    void Promise.resolve(useCart.persist.rehydrate()).then(() => {
      const items = useCart.getState().items;
      setSnapshot(items);
      if (items.length > 0) {
        track("purchase", { order: orderNumber });
        useCart.getState().clear();
      }
    });
  }, [orderNumber]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <CheckCircle2 className="text-primary mx-auto size-16" aria-hidden="true" />
      <h1 className="text-h2">Thank you for your order!</h1>
      <p className="text-text-muted">
        Your order number is <strong className="text-text font-mono text-lg">{orderNumber}</strong>.
        We&apos;ve emailed your confirmation once payment clears.
      </p>
      {snapshot.length > 0 ? (
        <GlassCard className="text-left">
          <h2 className="text-h3 mb-3">Summary</h2>
          <ul className="space-y-2 text-sm">
            {snapshot.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>
                  {i.quantity} × {i.name}
                </span>
                <span>{formatPHP(i.unitPriceCentavos * i.quantity)}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}
      <GlassCard className="space-y-4 text-left">
        <h2 className="text-h3">Get ready for your device</h2>
        <p className="text-text-muted">
          Install the mobile app and skim the Guidebook so you can start reading your soil on day
          one.
        </p>
        <StoreBadges />
        <EcosystemLink href={siteConfig.links.guidebook} target="guidebook">
          Open the Guidebook
        </EcosystemLink>
      </GlassCard>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/orders/track">Track your order</Button>
        <Button href="/products" variant="secondary">
          Keep shopping
        </Button>
      </div>
    </div>
  );
}
