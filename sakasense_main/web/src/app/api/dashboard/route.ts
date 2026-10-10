import { NextResponse } from "next/server";

/**
 * Proxy to Django backend for dashboard data.
 * Uses Next.js rewriting to forward to the configured backend.
 */
export async function GET() {
  try {
    const response = await fetch(new URL('/api/dashboard/', 'http://localhost:3000'));
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 502 }
    );
  }
}