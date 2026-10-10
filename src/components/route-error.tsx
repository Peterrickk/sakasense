"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** Shared body for route-group error.tsx files. */
export function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error.digest ?? error.name);
  }, [error]);
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-h2">Something went wrong</h1>
      <p className="text-text-muted mx-auto mt-3 max-w-md">
        Sorry about that. Please try again, or head back home.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Back home
        </Button>
      </div>
    </div>
  );
}
