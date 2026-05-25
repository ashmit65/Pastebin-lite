import { headers } from "next/headers";
import { notFound } from "next/navigation";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) notFound();

  const res = await fetch(`${proto}://${host}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error("Failed to load paste");
  }

  const paste = (await res.json()) as PasteResponse;

  return (
    <main style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Pastebin Lite</h1>
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
