// LanguWay English: username + password sign-up (v5: stricter password rule, optional origin allow-list, body size cap, no error detail leak; per-IP limit fails open). Deployed as the Edge Function "signup" (verify_jwt OFF).
// Creates an already-confirmed account whose internal email is <username>@languway.app. No real email is used.
// If the username is taken the function answers 409 {error:"exists"}.
import { createClient } from "jsr:@supabase/supabase-js@2";

/* CORS allow-list: set the secret ALLOWED_ORIGINS (comma separated, e.g. "https://my-site.com,https://www.my-site.com") to accept sign-ups only from your own site.
   While the secret is empty the function stays open ("*") so nothing breaks before you set it. */
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map((x) => x.trim().replace(/\/$/, "")).filter(Boolean);
const corsFor = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allow = ALLOWED.length ? (ALLOWED.includes(origin) ? origin : "null") : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  };
};
const json = (req: Request, b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsFor(req), "Content-Type": "application/json" } });
const COMMON = new Set(["12345678", "123456789", "1234567890", "password", "password1", "qwertyui", "qwerty123", "11111111", "00000000", "iloveyou", "abc12345", "12341234", "87654321", "english1", "languway"]);

let admin: ReturnType<typeof createClient> | null = null;
const client = () =>
  admin ??= createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsFor(req) });
  if (req.method !== "POST") return json(req, { error: "method" }, 405);
  if (ALLOWED.length && !ALLOWED.includes(req.headers.get("origin") || "")) return json(req, { error: "forbidden" }, 403);
  try {
    const raw = await req.text();
    if (raw.length > 2048) return json(req, { error: "too_large" }, 413);
    const body = JSON.parse(raw);
    if (typeof body !== "object" || body === null) return json(req, { error: "failed" }, 400);
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim().slice(0, 30);
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return json(req, { error: "invalid_username" }, 400);
    if (password.length < 8 || password.length > 72 || COMMON.has(password.toLowerCase()) || password.toLowerCase() === username || /^(.)\1+$/.test(password)) return json(req, { error: "weak_password" }, 400);
    /* Abuse guard: at most 40 sign-ups per IP per hour (generous: schools and mobile networks share IPs). Never blocks if the check itself fails. */
    try {
      const ip = (req.headers.get("cf-connecting-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0] || "unknown").trim().slice(0, 64);
      const since = new Date(Date.now() - 3600_000).toISOString();
      const { count } = await client().from("signup_attempts").select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
      if ((count ?? 0) >= 40) return json(req, { error: "rate_limited" }, 429);
      await client().from("signup_attempts").insert({ ip });
      if (Math.random() < 0.05) await client().from("signup_attempts").delete().lt("created_at", new Date(Date.now() - 86400_000).toISOString());
    } catch (_e) { /* fail open */ }
    const email = `${username}@languway.app`;
    let last = "";
    for (let i = 0; i < 3; i++) {
      const { error } = await client().auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { name, username },
      });
      if (!error) return json(req, { ok: true });
      const m = (error.message || "").toLowerCase();
      if (m.includes("already") || (error as any).code === "email_exists") return json(req, { error: "exists" }, 409);
      if (m.includes("password")) return json(req, { error: "weak_password" }, 400);
      last = m;
      await new Promise((r) => setTimeout(r, 300 * (i + 1) + Math.random() * 300));
    }
    void last; return json(req, { error: "failed" }, 503);
  } catch (_e) {
    return json(req, { error: "failed" }, 400);
  }
});
