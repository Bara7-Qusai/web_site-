import { NextResponse, type NextRequest } from "next/server";
import { fieldErrors, inquirySchema } from "@/lib/inquiry";
import { deliverInquiry, NotConfiguredError } from "@/lib/inquiry-delivery";

// Simple in-memory rate limit (per server instance): 5 inquiries / 10 minutes / IP.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

export async function POST(request: NextRequest) {
  // Reject cross-site form posts.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot filled → pretend success so bots learn nothing.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 400 });
  }

  try {
    const channel = await deliverInquiry(parsed.data);
    return NextResponse.json({ ok: true, channel });
  } catch (error) {
    if (error instanceof NotConfiguredError) {
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    console.error("[inquiry] delivery failed", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
