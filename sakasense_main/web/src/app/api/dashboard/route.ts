import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

/**
 * Proxy to Django backend for dashboard data.
 * Calls the Django `api` service through the SAKASENSE_API_URL binding.
 */
export async function GET() {
  try {
    const response = await fetch(apiUrl("api/dashboard/"), { cache: "no-store" });
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