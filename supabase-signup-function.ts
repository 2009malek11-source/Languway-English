// LanguWay English: username + password sign-up (v4: adds a generous per-IP limit, fails open). Deployed as the Edge Function "signup" (verify_jwt OFF).
// Creates an already-confirmed account whose internal email is <username>@languway.app. No real email is used.
// If the username is taken the function answers 409 {error:"exists"}.
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

let admin: ReturnType<typeof createClient> | null = null;
const client = () =>
  admin ??= createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const body = await req.json();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim().slice(0, 30);
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return json({ error: "invalid_username" }, 400);
    if (password.length < 6 || password.length > 72) return json({ error: "weak_password" }, 400);
    /* Abuse guard: at most 40 sign-ups per IP per hour (generous: schools and mobile networks share IPs). Never blocks if the check itself fails. */
    try {
      const ip = (req.headers.get("cf-connecting-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0] || "unknown").trim().slice(0, 64);
      const since = new Date(Date.now() - 3600_000).toISOString();
      const { count } = await client().from("signup_attempts").select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
      if ((count ?? 0) >= 40) return json({ error: "rate_limited" }, 429);
      await client().from("signup_attempts").insert({ ip });
      if (Math.random() < 0.05) await client().from("signup_attempts").delete().lt("created_at", new Date(Date.now() - 86400_000).toISOString());
    } catch (_e) { /* fail open */ }
    const email = `${username}@languway.app`;
    let last = "";
    for (let i = 0; i < 3; i++) {
      const { error } = await client().auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { name, username },
      });
      if (!error) return json({ ok: true });
      const m = (error.message || "").toLowerCase();
      if (m.includes("already") || (error as any).code === "email_exists") return json({ error: "exists" }, 409);
      if (m.includes("password")) return json({ error: "weak_password" }, 400);
      last = m;
      await new Promise((r) => setTimeout(r, 300 * (i + 1) + Math.random() * 300));
    }
    return json({ error: "failed", detail: last.slice(0, 80) }, 503);
  } catch (_e) {
    return json({ error: "failed" }, 400);
  }
});
