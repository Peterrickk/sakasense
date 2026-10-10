import { NextResponse } from "next/server";

/**
 * Proxy to Django backend for device ingestion.
 * Uses Next.js rewriting to forward to the configured backend.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as {
    serial_number?: string;
    readings?: unknown[];
    recommendation?: unknown;
  };

  if (!payload.serial_number) {
    return NextResponse.json({ error: "serial_number required" }, { status: 400 });
  }

  try {
    // Forward to our own API endpoint (gets rewritten by next.config.js)
    const response = await fetch(new URL('/api/device/ingest/', request.url), {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error forwarding to backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 502 }
    );
  }
}