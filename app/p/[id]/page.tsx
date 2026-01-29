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
    .select("content")
    .eq("id", id)
    .single();

  if (!paste) {
    notFound();
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Pastebin Lite</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#111",
          color: "#eee",
          padding: 16,
          borderRadius: 6,
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
