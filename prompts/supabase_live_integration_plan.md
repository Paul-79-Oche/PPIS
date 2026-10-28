# Supabase Full Integration & Live Activation Implementation Plan

## 1. Goal
Activate and verify live Supabase services (Database, Auth, and Storage) for Precious Pearls International School (PPIS) using the configuration in `server/.env.example` and the schema already executed in the Supabase SQL Editor. Ensure all frontend and backend features work seamlessly end-to-end without introducing out-of-scope services.

---

## 2. Scope & AGENTS.md Compliance
- **In Scope**:
  - Setting up `server/.env` with the active Supabase project credentials (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`).
  - Verifying the live connection to Supabase database tables (`studentREG`, `student_results`, `school_media`).
  - Verifying and initializing the `school-media` Supabase Storage bucket for photo and video uploads.
  - Setting up / seeding the primary staff admin user via Supabase Auth Admin API (`supabase.auth.admin.createUser`) so authorized school staff can immediately log in without requiring manual email confirmation.
  - Ensuring the Express backend server (`server/index.js`) runs smoothly on port 5000 and connects with the Vite frontend.
  - Adding a unified root script (e.g. `npm run server` and `npm run dev:all`) in `package.json` to make running both frontend and backend effortless.
  - Testing full live workflows: Admin Login, Media Upload/Delete, Student Registration, Result Entry/Lookup.
- **Out of Scope**:
  - Payment gateways or fees collection.
  - Unrelated school management modules (attendance, payroll, hostels, etc.).
  - Standalone PostgreSQL or alternative database/auth providers.

---

## 3. Technical Architecture & Credentials

- **Supabase Project URL**: `https://bcvnmhfwfpvozmgugwey.supabase.co`
- **Supabase Service Role Key**: Loaded securely into `server/.env` (never exposed to browser or frontend bundle).
- **Storage Bucket**: `school-media` (Public read, authenticated upload/delete).
- **Database Tables**:
  - `public.studentREG`
  - `public.student_results`
  - `public.school_media`

```text
React + Tailwind (Vite Dev Server :5173)
        │
        │ HTTP REST + Bearer JWT
        ▼
Node.js + Express Server (Port :5000)
        │
        │ Supabase Client (Service Role Key)
        ▼
Supabase Managed Backend:
  ├── Supabase Database (PostgreSQL + RLS)
  ├── Supabase Storage (`school-media` bucket)
  └── Supabase Auth (Admin authentication)
```

---

## 4. Implementation Steps

### Step 1: Environment File Configuration
- Create `server/.env` populated directly with the live Supabase URL, Service Role Key, and port 5000 from `server/.env.example`.
- Ensure `.gitignore` continues to prevent `.env` from being committed to Git.

### Step 2: Supabase Storage & Bucket Self-Healing Check
- In `server/config/supabase.js` or a startup check:
  - Verify that the `school-media` storage bucket exists.
  - If missing or unconfigured, auto-create it with `public: true` using `supabase.storage.createBucket('school-media', { public: true })`.

### Step 3: Admin User Provisioning / Seed Script
- Create a lightweight seed/setup script `server/scripts/initAdmin.js` using `supabase.auth.admin.createUser()`:
  - Creates the primary admin account: `admin@ppis.edu.ng` with confirmed email (`email_confirm: true`).
  - Sets an initial admin password (e.g. `Admin@PPIS2025!` or customized by user).
  - If the user already exists, safely ignores or logs status without crashing.

### Step 4: Express Server Scripts & Concurrency
- In root `package.json`:
  - Add `"server": "node server/index.js"` (or with nodemon if installed).
  - Add `"dev:all": "concurrently \"npm run dev\" \"npm run server\""` or clear command instructions so developers can run backend and frontend simultaneously.

### Step 5: Backend Endpoint Verification Against Live Supabase
- Verify `POST /api/auth/login`:
  - Authenticates credentials against live Supabase Auth and returns JWT token and user info.
- Verify `POST /api/media` & `GET /api/media` & `DELETE /api/media/:id`:
  - Uploads photo/video buffer to `school-media` bucket in Supabase Storage.
  - Retrieves public URL and records metadata in `public.school_media`.
  - Deletes file from storage and database row.
- Verify `POST /api/results/students` & `GET /api/results/students`:
  - Writes and reads from `public.studentREG`.
- Verify `POST /api/results` & `GET /api/results/:studentId` & `GET /api/results/lookup`:
  - Writes and reads from `public.student_results`.

### Step 6: Frontend Integration Verification
- Test Login via `http://localhost:5173/login`.
- Test CMS Overview via `http://localhost:5173/admin`.
- Test Media Upload & Public Media Gallery display at `http://localhost:5173/media`.
- Test Student Registration & Result Entry in CMS.
- Test Public Student Result Lookup at `http://localhost:5173/results`.

---

## 5. Verification & Testing Plan
1. **Database & Storage Live Ping**:
   - Run a test script to query Supabase tables and verify bucket status.
2. **Admin Auth Test**:
   - Run `node server/scripts/initAdmin.js` to ensure `admin@ppis.edu.ng` is provisioned.
   - Send `POST /api/auth/login` and verify HTTP 200 with JWT access token.
3. **Live Media Test**:
   - Upload a test image through CMS -> Check that image is publicly accessible from Supabase Storage CDN URL.
   - Delete the test image -> Check that storage object and database row are removed.
4. **Live Results Test**:
   - Register a student through CMS -> Check `studentREG` in Supabase.
   - Add result scores -> Check `student_results` in Supabase.
   - Search on public Results page (`/results`) -> Confirm student card and grade table render accurately.
5. **Lint and Build Checks**:
   - Run `npm run build` and `npm run lint` to guarantee zero errors.
