import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

/**
 * Proxy to Django backend for device ingestion.
 * Calls the Django `api` service through the SAKASENSE_API_URL binding.
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
    const response = await fetch(apiUrl("api/device/ingest/"), {
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