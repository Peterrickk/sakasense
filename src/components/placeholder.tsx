/**
 * Renders a config value, but in production hides anything that is still a [PLACEHOLDER]
 * so no placeholder text is visible to customers. In development it stays visible as a reminder.
 */
export function Placeholder({ value }: { value: string }) {
  if (value.includes("[PLACEHOLDER")) {
    return process.env.NODE_ENV === "production" ? null : (
      <span className="text-warning">{value}</span>
    );
  }
  return <>{value}</>;
}

export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.includes("[PLACEHOLDER");
}

/** Owner-facing reminder that only renders outside production. */
export function DevNote({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return <span className="text-warning text-xs">{children}</span>;
}
