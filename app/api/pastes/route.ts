import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { getNow } from "@/lib/now";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return NextResponse.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = nanoid(10);
  const now = getNow();

  const expires_at = ttl_seconds
    ? new Date(now.getTime() + ttl_seconds * 1000).toISOString()
    : null;

  await supabase.from("pastes").insert({
    id,
    content,
    expires_at,
    max_views
  });

  const origin = req.headers.get("origin");

return NextResponse.json({
  id,
  url: `${origin}/p/${id}`,
});

}
