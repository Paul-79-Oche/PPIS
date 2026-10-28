# About Page UI Implementation Prompt

## Goal
Implement the Precious Pearls International School (PPIS) About Page to match the provided design reference, following the workflow rules in `AGENTS.md`.

## Visual & Layout Requirements (Based on Reference Image)
1. **Page Header Banner (`PageHeader.jsx`)**:
   - Background image: PPIS school compound/students banner (`hero_bg.jpg`) with dark navy overlay (`rgba(8, 27, 61, 0.80)`).
   - Centered large title: **"About PPIS"** (or **"About Us"**).
   - Breadcrumb navigation: `Home › About` with subtle opacity and white current page highlight.

2. **About PPIS Intro Section**:
   - Clean white background.
   - Centered section heading: **"About PPIS"** (`#0B2555`, bold).
   - School building banner photo centered with rounded corners and clean framing.

3. **Our Story Section**:
   - Two-column responsive layout (`about-story-grid`):
     - **Left column**: Group photo of PPIS students in school uniform (`students_story.jpg`), rounded corners (`borderRadius: 10px`).
     - **Right column**: Section heading **"Our Story"**, accompanied by descriptive paragraphs outlining PPIS's history, commitment to quality education, discipline, and holistic development.

4. **Our Vision & Mission Section**:
   - Light background (`#F8FAFC`) separating the story section.
   - Two structured feature rows with circular icon badges:
     - **Our Vision**: Circular soft-blue bordered badge with eye icon, heading **"Our Vision"**, text: *"To be a centre of excellence in education, producing well-rounded individuals who make a positive impact in society."*
     - **Our Mission**: Circular soft-blue bordered badge with target/bullseye icon, heading **"Our Mission"**, text: *"To provide quality education, promote good character and equip our students with the skills needed for a brighter future."*

5. **Responsiveness**:
   - Mobile breakpoint (`< 768px`) gracefully stacks two-column grids into single columns with appropriate vertical spacing.

## Verification Plan
1. Check build using `npm run build`.
2. Verify visual appearance and layout at `http://localhost:5173/about`.
3. Check mobile responsive stacking and navigation.
