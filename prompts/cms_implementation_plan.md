# PPIS School Management System (CMS) Implementation Plan

## 1. Overview & Scope Alignment (Strictly following `AGENTS.md`)

This implementation plan details the complete implementation for the **Precious Pearls International School (PPIS) Content Management System (CMS)** / Admin section. It enables authorized staff to securely manage website media and student academic results.

### In Scope
- **Admin Authentication**: Secure login (`/login`) and protected admin route guarding.
- **School Media Management**:
  - Upload school pictures and videos (file, media type, caption/description).
  - List and preview all uploaded media items.
  - Delete media items (removes file from Supabase Storage and row from database).
- **Student Information & Result Management**:
  - Register new students into `studentREG` (`name`, `age`, `adm_year`).
  - View registered students list with search/filter.
  - View, add, update, and delete individual student results (`subject`, `score`, `grade`, `term`).
- **Public & Admin Sync**: Ensure public pages (`/media` and `/results`) dynamically reflect CMS updates.
- **PPIS Visual Identity**: Consistent navy blue (`#0B2555`), white, and light-blue accents (`#2563EB`, `#4D9FD6`), responsive for mobile and desktop.

### Out of Scope (Do NOT invent or include)
- School fees payment or payment gateways.
- Unrelated school management features (attendance, payroll, hostel, transport, timetable).
- Standalone PostgreSQL or unapproved third-party services.
- Over-engineered features not required for PPIS website management.

---

## 2. Architecture & Data Flow

```text
React + Tailwind (Admin UI)
        │  (HTTP + Bearer JWT)
        ▼
Node.js + Express API (`server/`)
        │  (Service Role / Admin verification)
        ▼
Supabase (Database: `studentREG`, `student_results`, `school_media` + Storage: `school-media` + Supabase Auth)
```

1. **Frontend (`src/`)**:
   - `src/context/AuthContext.jsx`: Manages admin session, token, and login/logout state.
   - `src/components/ProtectedRoute.jsx`: Redirects unauthenticated users to `/login`.
   - `src/pages/admin/AdminLayout.jsx`: Responsive CMS navigation header/sidebar, metrics overview, and quick links.
   - `src/pages/admin/AdminDashboard.jsx`: Overview summary cards (total media, total students, total results) and quick actions.
   - `src/pages/admin/AdminMedia.jsx`: Media list, image/video previews, upload modal with file picker, and deletion.
   - `src/pages/admin/AdminStudents.jsx`: Student registration form, roster table, and link to results.
   - `src/pages/admin/AdminResults.jsx`: Student result viewer, result entry form, inline edit modal, and result deletion.
   - `src/pages/LoginPage.jsx`: Polished login screen matching PPIS branding.

2. **Backend (`server/`)**:
   - `server/routes/auth.js`: Admin login endpoint (`POST /api/auth/login`) using Supabase Auth, returning access token and admin details.
   - `server/routes/media.js`: Existing `POST /api/media` (multer upload to Supabase Storage + DB row) and `DELETE /api/media/:id` (delete file from Storage + delete DB row).
   - `server/routes/results.js`:
     - Add `GET /api/results/students` (Admin only) to list registered students.
     - Add `DELETE /api/results/students/:id` (Admin only) to remove student records.
     - Existing `POST /api/results/students` (Add student).
     - Existing `POST /api/results` (Add result), `PUT /api/results/:id` (Update result), `DELETE /api/results/:id` (Delete result).

---

## 3. Database & Storage Verification

Using the existing `server/db/schema.sql`:
1. **`studentREG` table**:
   - `id`: UUID (Primary Key)
   - `name`: TEXT NOT NULL
   - `age`: INTEGER NOT NULL
   - `adm_year`: INTEGER NOT NULL
   - `created_at`: TIMESTAMPTZ NOT NULL
2. **`student_results` table**:
   - `id`: UUID (Primary Key)
   - `student_id`: UUID NOT NULL REFERENCES `studentREG(id)` ON DELETE CASCADE
   - `subject`: TEXT NOT NULL
   - `score`: INTEGER NOT NULL
   - `grade`: TEXT NOT NULL
   - `term`: TEXT NOT NULL
   - `created_at`: TIMESTAMPTZ NOT NULL
3. **`school_media` table**:
   - `id`: UUID (Primary Key)
   - `media_type`: TEXT NOT NULL CHECK (`media_type` IN ('image', 'video'))
   - `storage_path`: TEXT NOT NULL
   - `description`: TEXT
   - `upload_date`: TIMESTAMPTZ NOT NULL
   - `uploader_id`: UUID REFERENCES `auth.users(id)`
4. **Supabase Storage bucket**:
   - Bucket name: `school-media` (public read, authenticated write/delete).

---

## 4. Detailed Component & Route Implementation

### Step 1: Authentication & Protection
- Create `src/context/AuthContext.jsx`:
  - Stores `user`, `token`, `isAuthenticated`, `loading`.
  - Persists token in `localStorage` or `sessionStorage` with auto-restore on page refresh.
  - Exposes `login(email, password)` and `logout()`.
- Create `src/components/ProtectedRoute.jsx`:
  - Checks `isAuthenticated`. If false, redirects to `/login` with return path.
- Create `src/pages/LoginPage.jsx`:
  - Centered PPIS branded card with school logo, email input, password input, loading spinner, and error alert.
  - Redirects to `/admin` upon successful login.

### Step 2: Backend API Enhancements
- In `server/routes/results.js`:
  - Add `GET /api/results/students` with `requireAdmin` middleware to return all students ordered by admission year and name.
  - Add `DELETE /api/results/students/:id` with `requireAdmin` middleware to remove a student and their associated results.
- In `server/routes/auth.js` (or `server/index.js`):
  - Add `POST /api/auth/login` to authenticate staff via `supabase.auth.signInWithPassword({ email, password })` and return session token.

### Step 3: Admin CMS Layout & Navigation (`AdminLayout.jsx`)
- Top/Sidebar navigation with PPIS Navy theme:
  - Brand header with PPIS logo and "PPIS Admin Portal".
  - Nav tabs: **Dashboard**, **Media Management**, **Students**, **Student Results**.
  - Current staff indicator and **Logout** button.
  - Responsive collapse for mobile admin access.

### Step 4: School Media Management (`AdminMedia.jsx`)
- **Media List**:
  - Displays cards/table with media thumbnail, media type badge (`image` / `video`), caption/description, upload date, and a delete button with confirmation dialog.
- **Upload Modal**:
  - File input (supports images: jpg, png, webp; videos: mp4, webm).
  - Media type toggle (`image` vs `video`).
  - Caption/Description text input.
  - Upload progress / submit button with loading state.
  - Automatic refresh of media list upon successful upload.

### Step 5: Student & Results Management (`AdminStudents.jsx` & `AdminResults.jsx`)
- **Student Roster (`AdminStudents.jsx`)**:
  - "Register New Student" button opening modal: `Full Name`, `Age`, `Admission Year`.
  - Student table with search by name/year.
  - Quick action to "Manage Results" for that student or delete student.
- **Results Management (`AdminResults.jsx`)**:
  - Student selector dropdown / lookup.
  - Form to record new result: `Subject` (e.g. Mathematics, English, Basic Science), `Score` (0-100), `Grade` (auto-calculated A, B, C, etc. or manual override), `Term` (First Term, Second Term, Third Term).
  - Results Table showing all subjects for the selected student with Edit and Delete actions.
  - Edit Modal to modify score/grade/term.

### Step 6: Frontend Routing Updates in `src/App.jsx`
- Register routes:
  - `/login` -> `LoginPage`
  - `/admin` -> `ProtectedRoute` wrapping `AdminLayout`:
    - `index` -> `AdminDashboard`
    - `media` -> `AdminMedia`
    - `students` -> `AdminStudents`
    - `results` -> `AdminResults`
- Update `Navbar.jsx` login button to navigate to `/login` or `/admin` if already logged in.

---

## 5. Verification & Testing Plan

1. **Auth Verification**:
   - Access `/admin` directly without login -> Confirm redirection to `/login`.
   - Submit invalid credentials -> Verify error message display.
   - Submit valid credentials -> Verify redirect to `/admin` dashboard.
   - Click "Logout" -> Verify session cleared and redirect to `/login`.
2. **Media Management Verification**:
   - Upload test picture and test video with captions.
   - Verify items appear immediately in the admin media list.
   - Visit public `/media` page -> Confirm uploaded items display correctly with active filter tabs.
   - Delete an item from `/admin/media` -> Confirm removal from both admin view and public `/media` page.
3. **Student & Result Management Verification**:
   - Register a student (e.g., "Chioma Adebayo", Age: 11, Admission Year: 2024).
   - Add results for Mathematics and English in "First Term".
   - Edit Mathematics score and verify update.
   - Visit public `/results` page -> Search for "Chioma Adebayo" with year "2024" and verify results card/table displays accurate grades.
   - Delete a result and confirm public page updates accordingly.
4. **Code Quality & Build Checks**:
   - Run `npm run build` and `npm run lint` (oxlint) to verify zero build or syntax errors.
