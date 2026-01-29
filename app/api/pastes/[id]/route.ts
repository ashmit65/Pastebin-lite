import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getNow } from "@/lib/now";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data: paste } = await supabase
    .from("pastes")
    .select("*")
    .eq("id", id)
    .single();

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow();

  if (paste.expires_at && new Date(paste.expires_at) <= now) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views_used >= paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Count view ONLY in API
  await supabase
    .from("pastes")
    .update({ views_used: paste.views_used + 1 })
    .eq("id", id);

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : paste.max_views - paste.views_used - 1,
    expires_at: paste.expires_at,
  });
}
