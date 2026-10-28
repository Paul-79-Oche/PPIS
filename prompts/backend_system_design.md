# PPIS System Design & Backend Implementation

## Goal
Implement the core backend system design for the Precious Pearls International School (PPIS) website as specified in `AGENTS.md`. This includes setting up the Node.js/Express backend, configuring the Supabase connection, defining the database schema, and building the required API endpoints.

## Architecture
- **Backend:** Node.js with Express.js
- **Database & Storage:** Supabase (PostgreSQL, Supabase Storage)
- **Authentication:** Supabase Auth (for admin routes)
- **Integration:** The React/Vite frontend will communicate with this Express backend.

## 1. Setup & Configuration
- Initialize a `server` directory within the project or run the Express app concurrently.
- Install backend dependencies: `express`, `cors`, `dotenv`, `@supabase/supabase-js`, `multer` (for file uploads).
- Configure environment variables (`.env`) for Supabase URL and Service Role Key (kept strictly on the server).

## 2. Database Schema (Supabase)
We will create SQL scripts to set up the following tables and Row Level Security (RLS) policies:

### `studentREG` (Student Registration)
- `id`: UUID (Primary Key)
- `name`: Text (Required)
- `age`: Integer (Required)
- `adm_year`: Integer (Required)
- `created_at`: Timestamp

### `student_results` (Student Results)
- `id`: UUID (Primary Key)
- `student_id`: UUID (Foreign Key to `studentREG`) (Required)
- `subject`: Text
- `score`: Integer
- `grade`: Text
- `term`: Text
- `created_at`: Timestamp

### `school_media` (School Media)
- `id`: UUID (Primary Key)
- `media_type`: Text ('image' or 'video') (Required)
- `storage_path`: Text (Required)
- `description`: Text
- `upload_date`: Timestamp
- `uploader_id`: UUID (Foreign Key to Admin Auth User)

## 3. API Contracts (Express Routes)

### Public Routes (No Auth Required)
- `GET /api/media`
  - Fetches school pictures/videos available for public viewing.
- `GET /api/results/:studentId`
  - Retrieves the approved result information for a specific student.

### Admin Routes (Supabase Auth Required)
*These routes will use a middleware to verify the Supabase JWT token.*
- `POST /api/media`
  - Handles file upload to Supabase Storage and inserts metadata into the `school_media` table.
- `DELETE /api/media/:id`
  - Deletes media from Supabase Storage and removes the record from `school_media`.
- `POST /api/results`
  - Creates a new student result record.
- `PUT /api/results/:id`
  - Updates an existing student result.
- `DELETE /api/results/:id`
  - Deletes a student result.

## 4. Security Measures
- All environment secrets (Supabase Service Role Key) will be stored securely on the Node.js backend.
- Admin routes will strictly require authentication via Supabase Auth tokens.
- No direct database access or service-role operations will be performed from the React frontend.
- Uploaded media files will be validated before saving.
