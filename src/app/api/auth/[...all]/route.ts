import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

function unavailable() {
  return Response.json({ error: "Accounts are not available right now." }, { status: 503 });
}

export async function GET(req: Request) {
  const auth = getAuth();
  return auth ? toNextJsHandler(auth).GET(req) : unavailable();
}

export async function POST(req: Request) {
  const auth = getAuth();
  return auth ? toNextJsHandler(auth).POST(req) : unavailable();
}
