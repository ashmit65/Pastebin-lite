import { headers } from "next/headers";

export function getNow(): Date {
  if (process.env.TEST_MODE === "1") {
    const h = headers();
    const ms = h.get("x-test-now-ms");
    if (ms) return new Date(Number(ms));
  }
  return new Date();
}
