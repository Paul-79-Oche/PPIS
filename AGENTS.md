# AGENTS.md

You are a principal-level engineer building **Precious Pearls International School (PPIS) Website**,
a full-stack school website for school information, admission guidance, school media management,
and online student result viewing.

Your job: understand the request, use the right skills,
write a clear implementation prompt, get approval, then implement.

On approval, re-read the approved prompt file in prompt/ and implement it strictly. Implement only after approval.

## 1. Workflow

1. Read AGENTS.md.

2. Read the skills named in the prompt + any clearly needed
supporting skills.

3. Inspect relevant code.

4. Ask a focused question only if there's real ambiguity.

5. Write a detailed prompt file in prompts/.

6. Ask: "I prepared the implementation prompt at
prompts/<name>.md. Good to execute?"

7. Implement only after approval.

8. Run available checks.

9. Share exact test steps.

## 2. Product

Precious Pearls International School (PPIS) Website is a responsive full-stack
school website that provides school information, admission information, school
media, and online student result viewing.

The system also includes an admin section for authorized staff to manage school
pictures/videos and student results.

In scope:
- Public PPIS school information.
- Admission process and admission-related information.
- Public display of school pictures and videos.
- Admin login and protected admin section.
- Admin upload of school pictures and videos.
- Admin addition of media descriptions/captions.
- Admin viewing and management of uploaded media.
- Admin deletion/management of existing media.
- Online student result viewing for students/parents.
- Admin management of student information and results.
- Responsive interface for desktop and mobile devices.
- PPIS visual identity using navy blue, white, and suitable light-blue accents.
- React frontend with Tailwind CSS.
- Node.js/Express backend connected to Supabase.
- Git/GitHub for version control and Vercel for frontend deployment.

Out of scope:
- School-fees payment or online payment gateway.
- Unrelated school management systems such as attendance, payroll,
  transport management, or hostel management.
- Features that have not been requested or approved.
- A separate standalone PostgreSQL server.
- Unnecessary third-party services or frameworks.
- Overly complex functionality that is not required for the PPIS website.

Do not overbuild.

## 3. Skills

USE ONLY THESE SKILLS:

.agents/skills/clerk
.agents/skills/nodemailer
.agents/skills/supabase

USE THEM FOR:

- `.agents/skills/clerk`:
  Use only if Clerk is already part of the existing project or is explicitly
  approved for authentication. Do not introduce Clerk alongside Supabase Auth
  without a clear requirement.

- `.agents/skills/nodemailer`:
  Use only for email functionality if email notifications are explicitly
  requested and approved. Email is not part of the current core scope.

- `.agents/skills/supabase`:
  Use for the Supabase database, Storage for school pictures/videos,
  authentication where applicable, and database security/RLS policies.

DO NOT INVENT NEW SKILLS.

## 4. Architecture

- React.js + Vite + Tailwind CSS:
  Responsible for the user interface and presentation.

- Node.js + Express.js:
  Responsible for server-side API routes, business logic, validation,
  and privileged operations.

- Supabase:
  Responsible for the database, file storage, authentication where used,
  and database access policies.

- Public website:
  Displays PPIS information, admission information, school media,
  and student results through approved data access.

- Admin section:
  Allows authorized staff to manage school media and student results.

- The UI should display data and collect user input; privileged operations
  must be handled securely through the backend/Supabase security rules.

- Secrets and privileged credentials must remain server-side.

- School pictures and videos should be stored in Supabase Storage, while
  relevant metadata/reference information is stored in the Supabase database.

Architecture flow:

React + Tailwind
        |
        v
Node.js + Express
        |
        v
Supabase Database + Supabase Storage + Supabase Auth

## 5. Tech stack

Use:

- React.js — build the frontend user interface.
- Vite — development server and frontend build tooling.
- Tailwind CSS — responsive and consistent styling.
- Node.js — run the backend server.
- Express.js — build the backend API and server-side logic.
- Supabase — database, Storage, authentication, and security policies.
- Git — version control.
- GitHub — source-code repository and collaboration.
- Vercel — frontend deployment.

Do not use:

- A separate standalone PostgreSQL server; use Supabase's managed
  PostgreSQL database through Supabase.
- Another database service unless explicitly approved.
- A payment gateway or school-fees payment feature.
- Unnecessary frontend/backend frameworks.
- Hard-coded secrets or credentials.
- Unapproved third-party services.
- Unrelated refactors or features.

## 6. Data model

### `studentREG`

Purpose: store basic student registration information.

Key fields:
- `name`
- `age`
- `adm_year`
- Supabase-generated primary key/identifier

Required before saving:
- `name`
- `age`
- `adm_year`

### Student results

Student results must be linked to the relevant student record.

The exact result fields should follow the actual PPIS result format.
Do not invent unnecessary result columns. Confirm the school's required
result structure before implementing additional fields.

Required before saving:
- Valid student reference.
- Required result information based on the approved PPIS result format.

### School media

Purpose: store information about uploaded school pictures and videos.

Key fields:
- unique media identifier
- media type (`image` or `video`)
- storage path/reference
- description/caption
- upload date/time
- uploader/admin reference where required

Required before saving:
- valid media file
- media type
- valid storage reference after upload

The database should store media metadata/references while the actual
picture/video files are stored in Supabase Storage.

## 7. API contracts

### Public media

- `GET /api/media`
  - Return school pictures/videos available for public viewing.

### Admin media

- `POST /api/media`
  - Authenticated admin upload of school pictures/videos and their metadata.

- `DELETE /api/media/:id`
  - Authenticated admin deletion of a selected media item.

### Student results

- `GET /api/results/:studentId`
  - Retrieve the approved result information for a student.

### Admin results

- `POST /api/results`
  - Authenticated admin creates a student result.

- `PUT /api/results/:id`
  - Authenticated admin updates a student result.

- `DELETE /api/results/:id`
  - Authenticated admin deletes a student result.

Admin authentication should use the approved authentication mechanism
(Supabase Auth unless Clerk is explicitly selected). Do not create duplicate
authentication systems without a requirement.

API contracts must be kept small and changed only when a real requirement
requires it.

## 8. Security

Never expose to the browser:

- Supabase service-role key.
- Database passwords or direct database credentials.
- Server-side environment secrets.
- Private API keys.
- Admin-only secrets.
- Any other privileged server credentials.

Never run from the browser:

- Supabase service-role operations.
- Unprotected admin database writes.
- Unprotected deletion of media or results.
- Privileged operations that require server-side authorization.
- Any operation that bypasses database security/RLS policies.

Additional security requirements:
- Admin-only operations must require authentication and authorization.
- Validate uploaded media before saving.
- Validate required student/result data before database writes.
- Use Supabase Row Level Security (RLS) where applicable.
- Never trust data supplied by the browser without server-side/database
  validation.

## 9. Code standards

Small functions. Explicit types. No unrelated refactors. No
over-engineering.

Additional standards:
- Keep components focused and reusable.
- Use clear, meaningful names for files, variables, functions, routes,
  and database fields.
- Keep UI, business logic, and data access separated.
- Reuse existing project structure when it is already suitable.
- Do not rewrite working code without a clear reason.
- Handle loading, success, empty, and error states where appropriate.
- Keep the code simple enough for the project owner to understand,
  explain, test, and maintain.

## 10. When in doubt

Keep it small. Use the relevant skill. Ask a focused
question.

Save a prompt. Get approval. Implement. Run checks. Share
test steps.

Before implementing a major change:
1. Understand the requirement.
2. Inspect the existing code.
3. Identify the relevant skill.
4. Write the implementation prompt in `prompts/`.
5. Ask for approval.
6. Implement only after approval.
7. Run available checks/tests.
8. Provide exact steps for verifying the result.
