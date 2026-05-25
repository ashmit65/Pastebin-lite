import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { getNow } from "@/lib/now";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  let body: { content?: unknown; ttl_seconds?: unknown; max_views?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return NextResponse.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = nanoid(10);
  const now = await getNow();
  const expires_at = ttl_seconds
    ? new Date(now.getTime() + Number(ttl_seconds) * 1000).toISOString()
    : null;

  const { error } = await supabase.from("pastes").insert({
    id,
    content: content.trim(),
    expires_at,
    max_views: max_views ?? null,
  });

  if (error) {
    console.error("Create paste failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create paste",
        detail: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }

  const origin = env.appUrl ?? new URL(req.url).origin;
  return NextResponse.json({ id, url: `${origin}/p/${id}` });
}
