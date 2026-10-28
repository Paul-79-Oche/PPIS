# Homepage UI Implementation Prompt

## Goal
Implement the Precious Pearls International School (PPIS) homepage pixel-perfectly matching the uploaded reference image, following the workflow rules in `AGENTS.md`.

## Visual & Layout Requirements (Based on Uploaded Reference Image)
1. **Navbar Header**:
   - Left side: PPIS Official Logo with text "PPIS PRECIOUS PEARLS INTERNATIONAL SCHOOL".
   - Navigation Links: Home, About, Admission, Media, Results.
   - Right side: Search icon button and dark navy "Login" button.

2. **Hero Banner**:
   - Hero background image showing students in school uniform in front of the school building.
   - Text overlay: "Welcome to Precious Pearls International School" with subtext "Nurturing young minds, building bright futures."
   - Action Buttons: Blue "Learn More" solid button and outline "Admission" button.
   - Slide indicators (carousel dots) centered near the bottom of the hero banner.

3. **3 Core Features Section**:
   - 3 columns with light border separators:
     - **Quality Education**: Icon of a school house, text "We provide a conducive learning environment for holistic development."
     - **Experienced Staff**: Icon of teachers/staff, text "Our teachers are dedicated to guiding and supporting every student."
     - **Holistic Development**: Icon of a trophy, text "We nurture academic, moral and social growth in our students."

4. **About PPIS Section**:
   - Left column: Heading "About PPIS", description paragraph, and dark navy "Learn More" button.
   - Right column: Clean image displaying the PPIS school building with logo signage.

5. **Our Vision & Mission Section**:
   - Dark navy blue background (`#002B49` / `#0B2545`).
   - Two equal columns separated by a subtle vertical border:
     - **Our Vision**: Eye icon, title "Our Vision", text "To be a centre of excellence in education, producing well-rounded individuals who make a positive impact in society."
     - **Our Mission**: Target icon, title "Our Mission", text "To provide quality education, promote good character and equip our students with the skills needed for a brighter future."

6. **Quick Access Section**:
   - Heading "Quick Access".
   - 3 rounded card containers:
     - **Admission Process**: Graduation cap icon, description "Learn about our admission requirements and how to apply."
     - **School Media**: Image/gallery icon, description "View photos and videos of school activities and events."
     - **Student Results**: Result/document icon, description "Check your result online securely and easily."

7. **Footer**:
   - Dark footer consistent with overall school visual identity, containing quick links, contact info, and copyright statement.

## Proposed Code Structure & Components
- Modify `src/pages/HomePage.jsx` to assemble all homepage sections.
- Ensure components (`Navbar.jsx`, `Hero.jsx`, `Features.jsx`, `AboutSection.jsx`, `VisionMission.jsx`, `QuickAccess.jsx`, `Footer.jsx`) match exact layout, spacing, typography, and color palette from reference.

## Verification Plan
1. Check visually in browser at `http://localhost:5173/`.
2. Ensure layout responsiveness for both mobile and desktop screen sizes.
