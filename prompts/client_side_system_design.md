# Client-Side System Design & Implementation Plan

## Goal
Implement the complete frontend UI and page structure for Precious Pearls International School (PPIS) based on the provided reference image, and integrate it with the newly developed Express/Supabase backend.

## 1. UI Components & Design System
Refine `index.css` and create reusable UI components to match the reference image exactly:
- **Buttons:** `Primary Button` (Navy), `Secondary Button` (White with Navy border), `Small Button` (Navy).
- **Forms:** Standardized `Input Field` and `Dropdown` components with a light gray border and rounded corners.
- **Typography:** Ensure `Poppins` is used across all headings (Bold/Semi-bold), body text (Regular), and captions (Medium).
- **Colors:** Primary Navy (`#0B2555`), Accent Light Blue (`#4D9FD6`), Background White (`#FFFFFF`), Surface Soft Gray (`#F8F9FA`).

## 2. Reusable Page Components
- **`PageHeader.jsx`**: A reusable banner for the top of internal pages (About, Admission, Media, Results). It will display the page title (e.g., "About PPIS", "Check Student Results") on a dark blue overlay over a background image of the school.

## 3. Pages Implementation

### A. About Page (`/about`)
- **Page Header**: "About PPIS"
- **Our Story**: Text block describing the school's commitment to quality education. Includes an image alongside the text.
- **Vision & Mission**: Similar to the home page, but styled according to the About page layout in the design (two cards or sections).

### B. Admission Page (`/admission`)
- **Page Header**: "Admission Process"
- **How to Apply**: A vertical numbered list (1 to 4) detailing the steps:
  1. Obtain Application Form
  2. Fill and Submit
  3. Screening & Assessment
  4. Admission Offer

### C. Media Gallery Page (`/media`)
- **Page Header**: "School Media Gallery"
- **Filters**: Tabs for "All", "Pictures", and "Videos".
- **Gallery Grid**: A responsive CSS grid displaying thumbnails.
- **Integration**: Fetch data from `GET /api/media` on the backend and render it.

### D. Student Results Page (`/results`)
- **Page Header**: "Check Student Results"
- **Form**: Input field for "Full Name" and Dropdown for "Admission Year" (as shown in the design), plus a "View Result" button.
- **Integration**: We will need to map the Name and Year to a specific `studentId` to call `GET /api/results/:studentId`, or add a query endpoint on the backend to lookup the student by name and year.
- **Results Display**: A table or card layout to show the grades fetched from the backend.

## 4. Admin Integration (Future/Phase 2 Preparation)
- Prepare the `api.js` utility file using `fetch` or `axios` configured to point to `http://localhost:5000/api`.
- Set up React Router for the new pages.

---

> [!IMPORTANT]  
> **User Review Required**  
> 1. In the **Student Results Page** design, the form asks for "Full Name" and "Admission Year". Our backend API currently expects a `studentId` (`GET /api/results/:studentId`). Shall we look up the student by Name + Year on the backend, or would you prefer to change the UI to ask for a "Student ID" / "Registration Number"?
> 2. Does this client-side plan match your expectations?

If approved, I will begin implementing the Design System updates, the reusable `PageHeader`, and the individual pages sequentially.
