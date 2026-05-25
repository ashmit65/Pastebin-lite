function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeSupabaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (trimmed.startsWith("sb_publishable_") || trimmed.startsWith("sb_secret_")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is set to a key. It must be a URL like https://<project-ref>.supabase.co"
    );
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid URL like https://<project-ref>.supabase.co"
    );
  }
  if (!parsed.hostname.endsWith(".supabase.co")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must point to your Supabase project domain (*.supabase.co)"
    );
  }
  if (trimmed.includes("/rest/v1")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be the project URL only, e.g. https://<project-ref>.supabase.co"
    );
  }
  return trimmed;
}

function validateAnonKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed.startsWith("sb_secret_")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is using a secret key. Use the public anon key from Supabase Settings > API."
    );
  }
  return trimmed;
}

export const env = {
  supabaseUrl: normalizeSupabaseUrl(required("NEXT_PUBLIC_SUPABASE_URL")),
  supabaseAnonKey: validateAnonKey(required("NEXT_PUBLIC_SUPABASE_ANON_KEY")),
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
};
