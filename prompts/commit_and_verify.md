# Implementation Prompt: Commit Changes and Verify Admin Login

## Goal
Finalize the recent fixes (Vercel rewrite, Supabase init safety, dual‑prefix routing, and auth‑error handling) and ensure the admin login works on the deployed Vercel site.

## Steps
1. **Commit & Push**
   ```bash
   git add -A
   git commit -m "fix: admin login JSON error, Vercel rewrite, supabase init safety, dual route prefixes, auth error handling"
   git push origin main
   ```
   This triggers a new Vercel deployment.
2. **Configure Vercel Environment Variables**
   - `SUPABASE_URL` – your Supabase project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` – the service‑role key from `.env`.
   Ensure they are set for **Preview** and **Production**.
3. **Post‑Deploy Smoke Tests** (replace `<vercel-domain>` with your Vercel URL):
   ```bash
   curl https://<vercel-domain>/api/health
   # Expected: {"status":"ok",...}

   curl -X POST https://<vercel-domain>/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@example.com","password":"YOUR_PASSWORD"}'
   # Should return a JSON object with a session token or user data.
   ```
4. **Manual Verification**
   - Open the Vercel URL in a browser.
   - Navigate to the admin login page and sign in with a known admin account.
   - Confirm no console errors like `Unexpected token 'A'` appear.
5. **Documentation Update**
   - Add a short note to `README.md` about required Vercel env‑vars and the dual‑prefix routing design.

## Acceptance Criteria
- Admin login succeeds without JSON parsing errors.
- All API endpoints return valid JSON (including error responses).
- Vercel logs show no server‑side crashes.
- README includes the env‑var reminder.

---
*Prepared according to the AGENTS.md workflow.*
