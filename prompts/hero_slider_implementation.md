# Hero Section Slider Implementation Prompt

## Goal
Implement an automatic, responsive 3-image sliding carousel for the Hero section (`src/components/Hero.jsx`) using `hero_slide1.png`, `hero_slide2.png`, and `hero_bg.jpg`. The slides will slide left every few seconds with smooth transitions, interactive dot controls, navigation arrows, and accessible controls.

## Requirements

1. **Slide Data & Assets**:
   - Slide 1: `hero_slide1.png` — "Welcome to Precious Pearls International School" | "Nurturing young minds, building bright futures."
   - Slide 2: `hero_slide2.png` — "Excellence in Academics & Character" | "Empowering students to reach their highest potential."
   - Slide 3: `hero_bg.jpg` — "A Conducive Environment for Learning" | "Inspiring curiosity, leadership, and lifelong excellence."

2. **Sliding Behavior ("Slide Left in Seconds")**:
   - Automatic slide transition every 5 seconds advancing from left to right (content slides left: `transform: translateX(-currentIndex * 100%)`).
   - Smooth CSS sliding transition (`transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)`).
   - Pause auto-sliding on mouse hover or touch hold, resuming seamlessly when unhovered.

3. **User Controls & Interactions**:
   - **Slide Dot Indicators**:
     - 3 dots at the bottom of the hero text area.
     - The active dot is elongated (`width: 28px`, `#3B82F6`), inactive dots are compact (`width: 9px`, semi-transparent white).
     - Clicking any dot immediately slides to that slide and resets the auto-play timer.
   - **Navigation Arrows**:
     - Left and Right chevron buttons with subtle translucent backdrops, visible and accessible.
     - Clicking previous/next advances or reverses slides smoothly with wraparound.

4. **Visual Design & Typography**:
   - Dark gradient overlay preserved (`linear-gradient(90deg, rgba(5,18,50,0.90) 0%, rgba(8,27,65,0.78) 45%, rgba(11,37,85,0.25) 100%)`) to ensure optimal contrast and readability on all screens.
   - Retain PPIS brand colors (Navy blue `#0B2555`, Royal blue `#2563EB`, White `#ffffff`).
   - Retain CTA buttons ("Learn More" -> `/about`, "Admission" -> `/admission`).
   - Fully responsive design on mobile, tablet, and desktop viewports.

5. **Code Standards**:
   - Clean, lightweight React hooks (`useState`, `useEffect`, `useCallback`, `useRef`).
   - Proper cleanup of `setInterval` timers to avoid memory leaks.
   - Maintain semantic HTML and existing test IDs (`#hero`, `#hero-learn-more-btn`, `#hero-admission-btn`).

## Implementation Steps
1. Update `src/components/Hero.jsx`:
   - Import `hero_slide1.png`, `hero_slide2.png`, and `hero_bg.jpg`.
   - Setup slide configuration array with images, titles, and subtitles.
   - Implement `currentIndex` state and interval timer (5 seconds) with pause-on-hover.
   - Implement sliding track container with smooth horizontal translation.
   - Connect dot indicators and next/prev arrows with smooth state updates.
2. Verify visual appearance and responsiveness on local dev server (`http://localhost:5173/`).

## Verification Plan
1. Check that images automatically slide to the left every 5 seconds.
2. Click the dots to confirm navigation works and active dot updates.
3. Click the next/prev arrows to confirm bidirectional navigation.
4. Verify hover pauses auto-slide and leaving resumes it.
5. Verify responsive layout on desktop and mobile screens.
