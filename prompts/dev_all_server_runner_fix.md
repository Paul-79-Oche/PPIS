# Fix `npm run dev:all` Server Execution Implementation Plan

## 1. Goal
Ensure running `npm run dev:all` concurrently starts and keeps both the Vite frontend (`http://localhost:5173`) and the Express backend server (`http://localhost:5000`) running simultaneously with hot-reloading enabled.

---

## 2. Root Cause Analysis
1. In root `package.json`, the scripts are configured as:
   ```json
   "server": "node server/index.js",
   "server:dev": "nodemon",
   "dev:all": "concurrently --names \"VITE,SERVER\" --prefix-colors \"cyan,green\" \"npm run dev\" \"npm run server:dev\""
   ```
2. When executing `npm run dev:all`, `concurrently` executes `npm run server:dev`, which invokes `nodemon`.
3. `nodemon` is installed only inside `server/package.json` (`server/node_modules/`), but is missing from root `package.json` (`node_modules/`).
4. On Windows, executing `nodemon` from root fails with:
   `'nodemon' is not recognized as an internal or external command, operable program or batch file.`
5. Because the backend crashes immediately upon invocation, `concurrently` logs the error and shuts down the `[SERVER]` process, leaving only `[VITE]` running.

---

## 3. Scope & AGENTS.md Compliance
- **In Scope**:
  - Add `nodemon` to root `package.json` `devDependencies` so `nodemon` and the existing root `nodemon.json` configuration work seamlessly.
  - Ensure root `node_modules` contains `nodemon` binary.
  - Verify that `npm run server:dev` starts the backend on port 5000 and watches `server/` files.
  - Verify that `npm run dev:all` simultaneously boots both `[VITE]` (port 5173) and `[SERVER]` (port 5000).
- **Out of Scope**:
  - Modifying Supabase logic, routes, or frontend components.
  - Any architectural or database schema changes.

---

## 4. Implementation Steps

### Step 1: Install `nodemon` in Root `devDependencies`
- Install `nodemon` (`^3.1.14`) into the root `package.json` devDependencies via `npm install --save-dev nodemon`.
- Ensure root `node_modules/.bin/nodemon` is present.

### Step 2: Verify `server/package.json` Scripts (Optional Completeness)
- Add `"dev": "nodemon index.js"` and `"start": "node index.js"` to `server/package.json` so developers running directly inside `server/` can also start the server smoothly.

### Step 3: Verify Root `package.json` and `nodemon.json`
- Confirm `nodemon.json` at root correctly points to:
  ```json
  {
    "watch": ["server"],
    "ext": "js,json",
    "ignore": ["node_modules"],
    "exec": "node server/index.js"
  }
  ```
- Confirm `npm run server:dev` executes `nodemon` without path or missing binary errors.

---

## 5. Verification & Testing Plan
1. **Isolated Backend Check**:
   - Run `npm run server:dev` from root.
   - Confirm nodemon watches `server/` and outputs:
     `🚀 Server running on port 5000`
2. **Concurrent Execution Check (`npm run dev:all`)**:
   - Run `npm run dev:all`.
   - Confirm `[VITE]` starts at `http://localhost:5173`.
   - Confirm `[SERVER]` starts at `http://localhost:5000`.
   - Send health check request: `curl http://localhost:5000/api/health` and verify `{"status":"ok","message":"PPIS Backend API is running"}`.
3. **Lint & Build Sanity Check**:
   - Run `npm run lint` and `npm run build` to confirm no regressions.

