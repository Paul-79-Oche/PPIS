# Database & Route Connection Fix Implementation Plan

## 1. Goal
Connect the system cleanly to the updated Supabase database schema (`server/db/schema.sql`) and resolve the route conflict and table identifier mismatch that prevents the student and results endpoints from communicating with Supabase.

---

## 2. Root Cause Analysis
1. **Route Precedence Conflict in Express (`server/routes/results.js`)**:
   - `router.get('/:studentId')` was registered at line 50, before `router.get('/students')` at line 175.
   - When the frontend or admin panel requested `GET /api/results/students`, Express matched `:studentId` with value `"students"`.
   - It attempted to query a student where `id = "students"`, failed, and returned `404 Not Found`.

2. **Table Case Sensitivity in PostgreSQL / PostgREST (`public.studentreg`)**:
   - In `server/db/schema.sql`, the table is defined as `CREATE TABLE IF NOT EXISTS public.studentREG (...)`.
   - In PostgreSQL, unquoted table identifiers are automatically converted to lowercase: `studentreg`.
   - PostgREST exposes the endpoint as `studentreg`.
   - In `server/routes/results.js`, queries called `.from('studentREG')`, which failed with:
     `Could not find the table 'public.studentREG' in the schema cache`.
   - Testing `.from('studentreg')` confirmed that the table exists and responds with HTTP 200 / `OK`.

3. **Media & Storage Status**:
   - `school_media` and `school-media` storage bucket are already functioning and connected to Supabase (verified by live database records and uploaded files).

---

## 3. Implementation Steps

### Step 1: Reorder Express Routes in `server/routes/results.js`
- Move all specific static routes **above** parameterized route handlers:
  - `GET /api/results/students` (Admin list all students) -> Place before `/:studentId`.
  - `POST /api/results/students` (Admin create student) -> Keep grouped with student routes.
  - `DELETE /api/results/students/:id` (Admin delete student) -> Keep grouped with student routes.
  - `GET /api/results/lookup` (Public student result lookup) -> Keep before `/:studentId`.
  - `GET /api/results/:studentId` (Public single student lookup) -> Position **after** all static paths.

### Step 2: Harmonize Table Identifier to `studentreg`
- In `server/routes/results.js`, update all table queries:
  - Change `.from('studentREG')` to `.from('studentreg')` in lines 21, 57, 161, 178, 197.
  - Retain `student_results` and `school_media` table names.

### Step 3: Verification & Live Testing
- Test `GET /api/results/students` with admin Bearer token -> Confirm 200 OK.
- Test `POST /api/results/students` -> Create a test student record and verify insertion in Supabase.
- Test `POST /api/results` -> Insert a test term result for the student.
- Test `GET /api/results/lookup` -> Confirm public lookup returns the registered student and results.
- Verify Admin Dashboard (`/admin`), Students (`/admin/students`), and Results (`/admin/results`) in the browser.
- Run `npm run build` and `npm run lint` to confirm clean compilation.
