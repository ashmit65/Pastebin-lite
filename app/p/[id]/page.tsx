import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: paste } = await supabase
    .from("pastes")
    .select("*")
    .eq("id", id)
    .single();

  if (!paste) notFound();

  // TTL check
  if (paste.expires_at && new Date(paste.expires_at) <= new Date()) {
    notFound();
  }

  // max_views check
  if (paste.max_views !== null && paste.views_used >= paste.max_views) {
    notFound();
  }

  // increment view
  await supabase
    .from("pastes")
    .update({ views_used: paste.views_used + 1 })
    .eq("id", id);

  return (
  <main
    style={{
      padding: "16px",
      maxWidth: "800px",
      margin: "0 auto",
    }}
  >
    <h1 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>
      Pastebin Lite
    </h1>

    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        background: "#111",
        color: "#eee",
        padding: "12px",
        borderRadius: "6px",
        fontSize: "0.95rem",
        lineHeight: "1.4",
        overflowX: "auto",
      }}
    >
      {paste.content}
    </pre>
  </main>
);
}
