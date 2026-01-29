"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste() {
    setError("");
    setUrl("");

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setUrl(data.url);
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pastebin Lite</h1>

        <textarea
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={styles.textarea}
        />

        <div style={styles.row}>
          <input
            type="number"
            placeholder="TTL (seconds)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Max views"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            style={styles.input}
          />
        </div>

        <button onClick={createPaste} style={styles.button}>
          Create Paste
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {url && (
          <p style={styles.success}>
            Shareable URL: <br />
            <a href={url} target="_blank">{url}</a>
          </p>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#e5e7eb",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 600,
    background: "#020617",
    padding: 24,
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    resize: "vertical",
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
  },
  button: {
    marginTop: 16,
    width: "100%",
    padding: 12,
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 12,
    color: "#f87171",
  },
  success: {
    marginTop: 12,
    color: "#4ade80",
    wordBreak: "break-all",
  },
};
