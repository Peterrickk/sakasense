const PLACEHOLDER_RE = /\s*\[PLACEHOLDER[^\]]*\]\.?/g;

/** True when text still carries a [PLACEHOLDER ...] marker. */
export function hasPlaceholder(text: string | null | undefined): boolean {
  return Boolean(text && text.includes("[PLACEHOLDER"));
}

/**
 * Removes [PLACEHOLDER ...] markers. In production the result is what customers see;
 * an empty result means the whole item should be hidden.
 */
export function stripPlaceholders(text: string): string {
  return text.replace(PLACEHOLDER_RE, "").trim();
}

export const isProd = () => process.env.NODE_ENV === "production";

/** In production returns the cleaned text (or "" if nothing remains); in dev returns it unchanged. */
export function visibleText(text: string): string {
  return isProd() ? stripPlaceholders(text) : text;
}
