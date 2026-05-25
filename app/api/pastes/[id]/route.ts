import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getNow } from "@/lib/now";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data: paste, error: selectError } = await supabase
    .from("pastes")
    .select("id,content,expires_at,max_views,views_used")
    .eq("id", id)
    .single();

  if (selectError) {
    console.error("Fetch paste failed:", selectError);
    return NextResponse.json(
      {
        error: "Failed to fetch paste",
        detail: selectError.message,
        code: selectError.code,
      },
      { status: 500 }
    );
  }

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = await getNow();

  if (paste.expires_at && new Date(paste.expires_at) <= now) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views_used >= paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Count view ONLY in API
  const { error: updateError } = await supabase
    .from("pastes")
    .update({ views_used: paste.views_used + 1 })
    .eq("id", id);
  if (updateError) {
    console.error("Update views failed:", updateError);
    return NextResponse.json(
      {
        error: "Failed to update paste views",
        detail: updateError.message,
        code: updateError.code,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : paste.max_views - paste.views_used - 1,
    expires_at: paste.expires_at,
  });
}
