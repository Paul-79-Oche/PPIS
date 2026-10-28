# Frontend Directory Synchronization and Display Fix Implementation Plan

## 1. Goal
Ensure that running `npm run dev` from inside the `frontend/` directory (as well as from the root project directory) renders the complete, fully-featured Precious Pearls International School (PPIS) website—including navigation, hero banners, admissions, media gallery, student result checker, and the protected admin portal—instead of only showing the initial single-line placeholder.

---

## 2. Root Cause Analysis
1. **Directory Discrepancy**:
   - The user runs `cd frontend` followed by `npm run dev`.
   - The `frontend/` directory contains an unpopulated Vite template where `frontend/src/App.jsx` only contains:
     ```jsx
     function App() {
       return (
         <div className="min-h-screen flex items-center justify-center bg-slate-100">
           <h1 className="text-3xl font-bold text-blue-700">
             Precious Pearls International School
           </h1>
         </div>
       )
     }
     ```
   - In addition, `frontend/package.json` is missing key dependencies (`react-router-dom`, `lucide-react`, `@supabase/supabase-js`, `tailwindcss`), and `frontend/src/` is missing all pages, components, context, and media assets.
2. **Current Complete Source**:
   - The full, working application was built in the root directory (`/src`, `/public`, root `index.html`, root `vite.config.js`, root `package.json`).

---

## 3. Implementation Steps

### Step 1: Update `frontend/package.json` Dependencies
- Align `frontend/package.json` dependencies with the root project:
  - Add `react-router-dom` (`^7.18.4`)
  - Add `lucide-react` (`^1.46.0`)
  - Add `@supabase/supabase-js` (`^2.117.1`)
  - Add `tailwindcss` (`^4.3.3`)
  - Add `@rolldown/plugin-babel`, `@babel/core`, and `babel-plugin-react-compiler` for Vite React compiler consistency.
- Run `npm install` inside `frontend/`.

### Step 2: Synchronize Vite Configuration and Index HTML
- Copy root `vite.config.js` to `frontend/vite.config.js` to ensure Tailwind CSS and React plugins match.
- Copy root `index.html` (with correct page title, fonts, meta tags, and favicon) to `frontend/index.html`.
- Copy `public/` assets (favicons, icons) to `frontend/public/`.

### Step 3: Synchronize Frontend Source Files into `frontend/src/`
- Copy all UI modules from root `src/` to `frontend/src/`:
  - `src/components/` (`Navbar.jsx`, `Footer.jsx`, `Hero.jsx`, `AboutSection.jsx`, `Features.jsx`, `VisionMission.jsx`, `QuickAccess.jsx`, `PageHeader.jsx`, `ProtectedRoute.jsx`)
  - `src/pages/` (`HomePage.jsx`, `AboutPage.jsx`, `AdmissionPage.jsx`, `MediaPage.jsx`, `ResultsPage.jsx`, `LoginPage.jsx`, and `admin/` pages)
  - `src/context/` (`AuthContext.jsx`)
  - `src/assets/` (school logos, hero slides, and pictures)
  - `src/App.jsx` (complete React Router setup and layout routes)
  - `src/App.css` and `src/index.css` (custom PPIS color system and styles)

### Step 4: Environment Variables Setup
- Ensure `frontend/.env.local` contains the Supabase public credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`) so that data fetching, media viewing, and auth work properly when launched from `frontend/`.

---

## 4. Verification & Testing
1. **Build & Lint Verification**:
   - Run `npm run build` inside `frontend/` to verify zero TypeScript/JSX/bundling errors.
   - Run `npm run lint` inside `frontend/`.
2. **Browser Verification**:
   - Start the dev server in `frontend/` via `npm run dev`.
   - Verify on `http://localhost:5173`:
     - Navigation bar with PPIS logo, links (Home, About, Admission, Media, Results, Portal).
     - Hero carousel, quick access cards, and welcome sections.
     - About, Admission, Media gallery, and Result lookup pages.
     - Admin login at `/login` and CMS dashboard at `/admin`.
