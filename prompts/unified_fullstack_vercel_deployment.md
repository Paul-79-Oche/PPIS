# Unified Full-Stack Single Deployment Architecture Implementation Plan

## 1. Goal
Unify the Precious Pearls International School (PPIS) codebase into a single, cohesive repository structure that deploys both the React frontend and the Express backend simultaneously on Vercel from one GitHub repository—eliminating code duplication, hardcoded localhost URLs, and the need for separate deployments.

---

## 2. Scope & AGENTS.md Compliance
- **In Scope**:
  - Eliminate redundant duplicate `frontend/` directory (preserving any unique assets like `hero.png`) and remove the empty `backend/` directory.
  - Install backend dependencies (`express`, `cors`, `dotenv`, `multer`) into root `package.json` so Vercel installs all needed modules during root build.
  - Create a Vercel Serverless Function entrypoint at `api/index.js` that exports the Express `app`.
  - Refactor `server/index.js` to conditionally call `app.listen()` when run directly (`require.main === module`) while exporting `app` for serverless environments.
  - Create `vercel.json` to handle routing:
    - Route `/api/(.*)` to `/api/index.js` (Express backend).
    - Route all other paths `/(.*)` to `/index.html` (React client SPA router).
  - Update frontend API calls (`src/context/AuthContext.jsx`, `src/pages/MediaPage.jsx`, `src/pages/ResultsPage.jsx`) to use relative `/api` paths instead of hardcoded `http://localhost:5000/api`.
  - Configure Vite dev server proxy in `vite.config.js` to route `/api` requests to `http://localhost:5000` during local development (`npm run dev` and `npm run dev:all`).
  - Run linting, build, and local test runs to verify zero regressions.
- **Out of Scope**:
  - Payment gateways or fees collection.
  - Altering Supabase schemas, tables, or existing routes.
  - Unrelated refactoring.

---

## 3. Technical Architecture & File Structure

### Clean Target Directory Structure:
```text
PPIS_Project/
├── api/
│   └── index.js             <-- Vercel serverless entrypoint exporting Express app
├── server/
│   ├── config/              <-- Supabase client & bucket check
│   ├── db/                  <-- SQL schemas & reference files
│   ├── middleware/          <-- Auth verification middleware
│   ├── routes/              <-- Express route modules (auth, media, results)
│   ├── scripts/             <-- Seed and init scripts (initAdmin.js)
│   ├── .env                 <-- Local backend environment variables
│   └── index.js             <-- Express app declaration & local listener
├── src/                     <-- React 19 Frontend application
│   ├── assets/              <-- School branding, logos, images
│   ├── components/          <-- Shared UI components (Navbar, Footer, Hero, etc.)
│   ├── context/             <-- AuthContext
│   ├── pages/               <-- Public & Admin pages
│   ├── App.jsx              <-- React Router routes
│   └── main.jsx             <-- React entrypoint
├── public/                  <-- Favicon & icons
├── vercel.json              <-- Vercel routing rewrites (API serverless + SPA)
├── vite.config.js           <-- Vite dev proxy + Tailwind + React compiler
├── nodemon.json             <-- Hot-reloading watcher for server/
└── package.json             <-- Unified root scripts & dependencies
```

---

## 4. Implementation Steps

### Step 1: Consolidate Assets and Clean Duplicate Directories
- Copy `frontend/src/assets/hero.png` into `src/assets/hero.png` to ensure no asset is lost.
- Remove the redundant `frontend/` directory from Git tracking and disk (`git rm -r frontend`).
- Remove the empty `backend/` directory.

### Step 2: Install Server Dependencies in Root `package.json`
- Add and install backend packages (`express`, `cors`, `dotenv`, `multer`) to root dependencies:
  ```json
  "dependencies": {
    "@supabase/supabase-js": "^2.117.1",
    "@tailwindcss/vite": "^4.3.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "lucide-react": "^1.46.0",
    "multer": "^2.4.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.4",
    "tailwindcss": "^4.3.3"
  }
  ```
- Run `npm install --prefer-offline` at root to update `package-lock.json`.

### Step 3: Serverless Export & Vercel Bridge
- Update `server/index.js`:
  - Export `module.exports = app;`.
  - Wrap `app.listen(PORT, ...)` in `if (require.main === module)` so it runs as a standalone daemon in local dev (`npm run dev:all`), but acts as a request handler when invoked as a Vercel serverless function.
- Create `api/index.js`:
  ```javascript
  const app = require('../server/index.js');
  module.exports = app;
  ```

### Step 4: Configure `vercel.json`
- Create `vercel.json` at root:
  ```json
  {
    "version": 2,
    "rewrites": [
      {
        "source": "/api/(.*)",
        "destination": "/api/index.js"
      },
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

### Step 5: Configure Vite Dev Proxy & Remove Hardcoded URLs
- In `vite.config.js`, add server proxy:
  ```javascript
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
  ```
- In `src/context/AuthContext.jsx`:
  - Change `const API_BASE_URL = 'http://localhost:5000/api'` to `const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'`.
- In `src/pages/MediaPage.jsx`:
  - Replace `http://localhost:5000/api/media` with `/api/media`.
- In `src/pages/ResultsPage.jsx`:
  - Replace `http://localhost:5000/api/results/lookup` with `/api/results/lookup`.

---

## 5. Verification & Testing Plan

1. **Lint and Static Checks**:
   - Run `npm run lint` (`oxlint`) to verify syntax across all files.
2. **Production Build Check**:
   - Run `npm run build` to verify Vite bundles the SPA into `dist/` cleanly without broken asset links.
3. **Local Development Concurrency Verification**:
   - Run `npm run dev:all`.
   - Verify `[SERVER]` starts on `http://localhost:5000` with nodemon.
   - Verify `[VITE]` starts on `http://localhost:5173`.
   - Test proxy: Open `http://localhost:5173/api/health` in browser/curl and confirm `{"status":"ok","message":"PPIS Backend API is running"}`.
4. **Vercel Serverless Invocation Emulation**:
   - Test importing `api/index.js` in a node script and dispatching a mock request to verify the serverless export works.
5. **Git Cleanliness**:
   - Run `git status` to ensure `frontend/` and `backend/` are removed and only clean root files remain.

