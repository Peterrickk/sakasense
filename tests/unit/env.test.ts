import { afterEach, describe, expect, it, vi } from "vitest";
import { getEnv, resetEnvCache } from "@/lib/env";

describe("env validation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetEnvCache();
  });
  it("throws a clear error listing missing required variables in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("NEXT_PHASE", "");
    expect(() => getEnv()).toThrow(/Missing required environment variables:.*DATABASE_URL/);
  });
  it("rejects an invalid site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    expect(() => getEnv()).toThrow(/Invalid environment variables/);
  });
  it("works with defaults in development", () => {
    expect(getEnv().NEXT_PUBLIC_SITE_URL).toBeTruthy();
  });
});
