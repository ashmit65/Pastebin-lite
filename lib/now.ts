import { headers } from "next/headers";

export async function getNow(): Promise<Date> {
  if (process.env.TEST_MODE === "1") {
    const h = await headers();
    const ms = h.get("x-test-now-ms");
    if (ms) return new Date(Number(ms));
  }
  return new Date();
}
