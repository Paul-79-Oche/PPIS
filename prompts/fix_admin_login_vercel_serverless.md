# Fix Admin Login & Vercel Serverless Function Execution Implementation Plan

## 1. Goal
Resolve the `Unexpected token 'A', "A server e"... is not valid JSON` error when attempting to log into the admin portal on the deployed Vercel site. Ensure the Vercel serverless API handles requests reliably, recovers gracefully from missing or misnamed environment variables, maps rewrites properly, and provides structured JSON error responses instead of Vercel crash pages.

---

## 2. Root Cause Analysis
1. **Invalid Vercel Rewrite Destination**:
   - In `vercel.json`, the API rewrite was defined as:
     `{ "source": "/api/(.*)", "destination": "/api/index.js" }`
   - In Vercel serverless routing, rewrite destinations must target the route path `"/api"` (not the filesystem file `"/api/index.js"`). Pointing to `"/api/index.js"` causes Vercel to fail function routing and return its generic 500 page: `"A server error has occurred"`.
2. **Top-Level `createClient` Crash on Missing Environment Variables**:
   - In `server/config/supabase.js`, `createClient(supabaseUrl, supabaseServiceKey)` was executed immediately on module load.
   - If `SUPABASE_URL` is missing, empty, or named `VITE_SUPABASE_URL` in Vercel project settings, `@supabase/supabase-js` throws an unhandled `Error: supabaseUrl is required.`.
   - Because this occurs at top-level module import, the serverless container crashes during cold-start initialization before Express can handle the request or return a JSON error.
3. **Route Prefix Ambiguity on Rewritten Requests**:
   - When Vercel rewrites `/api/*` to `/api`, depending on the proxy headers, Express may receive either `/api/auth/login` or `/auth/login`.
   - If Express only mounts routes on `/api/auth`, any stripped path will fail to match.
4. **Client-Side Parsing of Non-JSON Responses**:
   - In `src/context/AuthContext.jsx`, `await res.json()` was called unconditionally. When Vercel or a proxy returns a non-JSON status page (starting with `"A server error..."`), `JSON.parse` crashes with `Unexpected token 'A'`.

---

## 3. Scope & AGENTS.md Compliance
- **In Scope**:
  - Fix `vercel.json` to route `/api/(.*)` to `"/api"`.
  - Ensure `api/index.js` explicitly exports the request handler `export default function handler(req, res) { return app(req, res); }`.
  - Harden `server/config/supabase.js` to support both `SUPABASE_URL` and `VITE_SUPABASE_URL` (and sanitize surrounding quotes), with lazy/safe fallback so the serverless function never crashes during cold start.
  - Mount dual route prefixes in `server/index.js` (`['/api/auth', '/auth']`, `['/api/media', '/media']`, `['/api/results', '/results']`, and `['/api/health', '/health']`).
  - Harden `src/context/AuthContext.jsx` to safely parse responses and display readable server error messages if non-JSON is returned.
- **Out of Scope**:
  - Changes to Supabase database schema or RLS policies.
  - Payment or fees integration.

---

## 4. Implementation Steps

### Step 1: Fix `vercel.json` Rewrite Destination
- Change `"destination": "/api/index.js"` to `"destination": "/api"`.

### Step 2: Update `api/index.js` Serverless Handler
- Export an explicit handler function:
  ```javascript
  import app from '../server/index.js';

  export default function handler(req, res) {
    return app(req, res);
  }
  ```

### Step 3: Harden `server/config/supabase.js` Against Missing Credentials
- Read `SUPABASE_URL` with fallbacks for `VITE_SUPABASE_URL` and sanitize quotes (`.trim().replace(/^["']|["']$/g, '')`).
- Read `SUPABASE_SERVICE_ROLE_KEY` with fallbacks for `SUPABASE_KEY` / `VITE_SUPABASE_ANON_KEY` and sanitize quotes.
- If credentials are not present, do not throw; log an error and return a safe stub so endpoints return clean JSON explaining that environment variables must be configured on Vercel.

### Step 4: Dual Prefix Support in `server/index.js`
- Mount routes on both `/api/<name>` and `/<name>`:
  - `app.use(['/api/auth', '/auth'], authRoutes);`
  - `app.use(['/api/media', '/media'], mediaRoutes);`
  - `app.use(['/api/results', '/results'], resultsRoutes);`
  - `app.get(['/api/health', '/health'], ...);`

### Step 5: Safe Response Parsing in `src/context/AuthContext.jsx`
- Check `res.headers.get('content-type')` before calling `res.json()`.
- If non-JSON text is returned, extract the text and show a readable error rather than crashing `JSON.parse`.

---

## 5. Verification & Testing Plan
1. **Local Node ESM & Handler Test**:
   - Run a test script importing `api/index.js` and invoking `handler` with mock request/response to verify successful dispatch.
2. **Missing Env Var Test**:
   - Test `server/config/supabase.js` in isolation with empty environment variables to verify it does not throw or crash on module load.
3. **Lint & Build Sanity Check**:
   - Run `npm run lint` (`oxlint`) and `npm run build` (`vite build`) to confirm zero regressions.
4. **Git Status & Push**:
   - Provide exact steps to push to GitHub and verify admin login on Vercel.

