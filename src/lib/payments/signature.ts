import { createHmac, timingSafeEqual } from "node:crypto";

/** Constant-time comparison of two hex signatures. */
export function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length > 0 && ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function hmacSha256Hex(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Parses `t=123,te=abc,li=def` style headers. */
export function parseSignatureHeader(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of header.split(",")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}
