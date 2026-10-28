# Term Selection for Student Result Checker Implementation Plan

## 1. Goal
Add a Term selection option (`First Term`, `Second Term`, `Third Term`, and `All Terms`) to the public student result checker page (`src/pages/ResultsPage.jsx`) and connect it to the backend result lookup endpoint (`server/routes/results.js`).

---

## 2. Scope & AGENTS.md Compliance
- **In Scope**:
  - Add Term dropdown to the search form on `src/pages/ResultsPage.jsx`.
  - Update `GET /api/results/lookup` in `server/routes/results.js` to accept an optional `term` query parameter and filter results accordingly.
  - Display the active term in the result report card.
- **Out of Scope**:
  - Payment or fees checking.
  - Adding unrequested database tables or fields.

---

## 3. Implementation Details

### Step 1: Backend Route Update (`server/routes/results.js`)
- In `GET /api/results/lookup`:
  - Extract `const { name, year, term } = req.query;`
  - Query student in `studentreg` by name and year.
  - Query `student_results`:
    - Base query: `.from('student_results').select('*').eq('student_id', student.id)`
    - If `term` is supplied and is not `'All'` or `'All Terms'`: apply `.eq('term', term)`.
    - Apply `.order('term', { ascending: true })`.
  - Return `{ student, results, term: term || 'All Terms' }`.

### Step 2: Frontend Result Checker Update (`src/pages/ResultsPage.jsx`)
- Define terms constant: `['All Terms', 'First Term', 'Second Term', 'Third Term']`.
- Add `term` state: `const [term, setTerm] = useState('All Terms')`.
- Add Term `<select>` field in the form with matching PPIS styling.
- Update `handleSearch` to pass `&term=${encodeURIComponent(term)}` to the lookup endpoint.
- In the results display table/card:
  - Show the queried term badge/indicator.
  - Render results table filtered to the requested term (or showing all terms if `All Terms` was chosen).

---

## 4. Verification & Testing Plan
1. **Live Backend Test**:
   - Send `GET /api/results/lookup?name=Chinedu&year=2025&term=First%20Term` -> Verify results only contain First Term.
   - Send `GET /api/results/lookup?name=Chinedu&year=2025&term=Second%20Term` -> Verify returns empty array for unrecorded term.
   - Send `GET /api/results/lookup?name=Chinedu&year=2025&term=All%20Terms` -> Verify returns all terms.
2. **Build & Lint Checks**:
   - Run `npm run build` and `npm run lint`.
3. **Browser Verification**:
   - Navigate to `http://localhost:5173/results`.
   - Select student name, year, and term, and confirm accurate result presentation.
