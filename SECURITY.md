# LanguWay English: security review (v24)

Scope: what this project owns (front-end code, headers config, the Supabase database rules, the sign-up function).
Not in scope: things the host or Supabase run for you (TLS certificates, password hashing inside Supabase Auth, server patching).

| # | Item | Finding | Severity | Fix | Test result |
|---|------|---------|----------|-----|-------------|
| 7 | XSS | Buttons built JavaScript from text that can come from outside (MyMemory community translations, saved words, imported backups). A crafted string could run code. | High | New `jq()` helper encodes every value used inside an `onclick`; all call sites replaced. Helper chips use it too. | Exploit ran on v23 (`pwn=1`), does not run on v24. 10 injection tests pass. |
| 1,5 | Login and passwords | Cloud accounts use Supabase Auth (bcrypt). Sign-up allowed 6 characters. Local-only mode (when no cloud is set) used one SHA-256 with a weak salt. | Medium | Minimum 8 characters, common/repeated passwords refused (function and form). Local mode now PBKDF2 (310,000 rounds, random salt); old local accounts are upgraded at next login. | Hash test passes. |
| 3 | Database | RLS is on with per-user policies and a 200 KB size cap. The API roles also had TRUNCATE, TRIGGER, REFERENCES. | Low | Revoked (migration `least_privilege_progress_grants`); sign-up log table closed to API roles. | Advisors show no warning for this project's tables. |
| 4 | HTTPS | Nothing forced it from the code. | Medium | `upgrade-insecure-requests` in the CSP, a small redirect from http to https, HSTS in `netlify.toml` and `_headers`. | CSP present (test). Headers need a host that reads these files. |
| 6,10 | Server checks / queries | Sign-up validated on the server already; now also body size limit, no error detail leak. All data access goes through Supabase's API and RLS (no string-built SQL). | Low | Function v5 deployed. | Reviewed. |
| 12 | Rate limiting | Sign-up: 40 per IP per hour. Login: Supabase's own limits. | Info | Kept. | Reviewed. |
| 13 | CORS | Sign-up function answered every origin. | Medium | Reads secret `ALLOWED_ORIGINS`; once you set it only your site can call it. (Open until set so nothing breaks.) | Needs your domain. |
| 14 | Headers | Only a CSP meta tag. | Medium | Full header set (CSP with `frame-ancestors`, HSTS, COOP, CORP, Permissions-Policy, nosniff, frame deny). | Reviewed. |
| 20 | Debug | No `console.log`, `eval` or debug flags. | Info | none needed | Scan clean. |
| 23-25 | Exposed files / keys | Only the public (publishable) Supabase key is in the code; no service key; no git repository in the zip. | Info | none needed | Scan clean. |
| 18 | Uploads | The only file input is the backup import. | Low | Must be `.json`, max 500 KB, passed through `clean()`. | Test passes. |
| 21 | Libraries | `supabase-js` 2.45.4 from a CDN without integrity check. A newer version exists. | Medium | Not changed: it needs a tested upgrade plus an SRI hash, which I cannot fetch from this environment. | Open (see steps below). |
| 7b | CSP `unsafe-inline` | The app uses inline `onclick` handlers, so scripts must allow inline code. | Medium | Not changed: removing it means rewriting the UI event handling (a big change). | Open, your decision. |

Not applicable here: admin pages (none), payments and prices (none), CSRF and cookies (sign-in tokens are kept by Supabase in browser storage, no cookies), password-reset links (no email is used).

## Your steps
1. Supabase dashboard: Authentication > Providers > Email: turn on leaked password protection, set minimum password length to 8, turn confirm email off.
2. Edge Functions > Secrets: add `ALLOWED_ORIGINS` with your site address, for example `https://your-site.com`.
3. Use a host that applies `netlify.toml` or `_headers` (Netlify or Cloudflare Pages). GitHub Pages ignores them, so only the meta CSP applies there.
4. Optionally: pin a newer `supabase-js` version, test sign-in, and add its `integrity` hash.
