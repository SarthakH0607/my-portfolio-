"# SpaceX-Style Mission Control Hero Redesign

Redesign the opening landing page (Scene 1: DeepSpace / Orbiting Solar System) to feature a premium split hero layout. The solar system will serve as an animated background, overlaid by a high-tech developer hero section on the left and a glassmorphic SpaceX-style mission control dashboard on the right.

## User Review Required

> [!IMPORTANT]
> - The animated solar system (with realistic Sun, galaxies, comets, and stars) will be kept active in the background.
> - "SARTHAK HUNDARE" will be presented in massive uppercase typography on the left side, serving as the main visual anchor of the page.
> - The SpaceX-style dashboard on the right side will feature glassmorphic cards, monospaced tech telemetry, and green status system checks.

## Proposed Changes

### [DeepSpace Component](file:///c:/Users/User/Desktop/Portfolio/src/components/scenes/DeepSpace.jsx)

#### [MODIFY] [DeepSpace.jsx](file:///c:/Users/User/Desktop/Portfolio/src/components/scenes/DeepSpace.jsx)
We will rewrite the HTML/JSX layout of the `SpaceOpening` overlay:
1. **Split-Screen Container**: A responsive layout (`flex flex-col md:grid md:grid-cols-12 md:gap-12`) that fills the viewport (`h-screen`) while supporting scrolling on small devices if necessary.
2. **Left Column (Hero Section)**:
   - Header tag: `[ STATUS: ORBITAL INSERTION COMPLETED ]` in monospaced, uppercase amber/warm styling.
   - Headline: Massive, bold font displaying **SARTHAK HUNDARE** in a gradient/white fill with light drop-shadow styling.
   - Telemetry details line: `> COORDINATES: Sol-3 // Mumbai • VELOCITY: ORBITAL • APEX ACTIVE`.
   - Call-To-Action buttons:
     - `Launch Mission` (Primary, triggers transition zoom to Earth/Mumbai).
     - `Flight Log` (Secondary, visual placeholder or scroll prompt).
3. **Right Column (Mission Control Dashboard)**:
   - Glassmorphic panels with dark overlay backgrounds (`rgba(12, 12, 29, 0.45)`), thin borders (`rgba(107, 138, 253, 0.15)`), and blurred backdr
<truncated 1107 bytes>