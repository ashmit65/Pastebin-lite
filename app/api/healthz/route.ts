import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await supabase.from("pastes").select("id").limit(1);
  return NextResponse.json({ ok: !error });
}
