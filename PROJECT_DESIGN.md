# PROJECT_DESIGN — Counter-Strike: The Long Game

## 1. Product Context

- Product: An original, interactive digital history of Counter-Strike.
- Target user: Counter-Strike players, esports fans, and curious visitors who know the game but not its full lineage.
- Target surface: A responsive, single-page editorial web experience.
- Primary job-to-be-done: Move through the major eras—from the 1999 Half-Life mod to CS2—and understand how maps, weapons, updates, and competitive culture shaped the game.
- Success criteria: The chronology is easy to follow; the first viewport is memorable; motion supports the sense of travelling through time; the experience remains complete on mobile, keyboard-only, and reduced-motion setups.
- Content that must appear: 1999 mod origins, 1.0/1.6, Condition Zero, Source, Global Offensive, landmark CS:GO updates and esports moments, CS2 transition, iconic map lineage, and a concise closing legacy statement.
- Interaction requirements: Intro sequence, scroll progress, era navigation, a pinned/scrubbed chronology, tactile artifact reveals, map comparison interaction, hover/pointer depth, and a mobile navigation drawer.
- Technical constraints: New project in an empty workspace. Build as a static Vite + React + TypeScript site. GSAP is the primary motion system. Lenis is the only smooth-scroll engine. No backend is required.

## 2. Existing UI Read

- Current visual vocabulary: No existing project UI.
- Strongest cue to preserve: The supplied mesh3d reference’s cinematic pacing, dimensional transitions, editorial scale, and gallery-like restraint.
- Components/tokens to reuse: None.
- Patterns to evolve: Translate “3D gallery” into a declassified historical archive with layered evidence, not a replica of the reference.
- Patterns to remove or avoid: Generic esports dashboards, neon HUD panels, card grids, fake live metrics, constant glitching, copied layouts, and copied reference assets.
- Accessibility/state conventions: Build semantic landmarks, visible focus, 44px touch targets, static first frames, and a full `prefers-reduced-motion` path.

## 3. Taste Direction

- Product identity sentence: A declassified digital museum about the game that taught a generation to hold an angle.
- Recommended taste direction: Dark cinematic archive—editorial, tactical, tactile, and restrained.
- Direction to avoid: A loud “gaming website” with glowing cards, RGB gradients, and decorative crosshairs.
- Why this is useful: Archival labels, dates, and clear narrative chapters make a complex 25-year history scannable, while spatial motion turns chronology into an experience.
- What should feel distinctive: Oversized year typography, evidence-stamp labels, layered map/weapon artifacts, a vertical “ballistic” timeline, and section transitions that feel like opening classified folders.
- What should stay quiet: Navigation chrome, body copy, controls, metadata, and most surfaces.

## 4. Selected References

### Supplied mesh3d “The state of the gallery”

- Why it fits: It uses a gallery metaphor, strong first-viewport hierarchy, spatial storytelling, and motion-led pacing.
- Transferable traits: Dimensional layering, deliberate scene changes, large type, minimal chrome, and interactive depth.
- Non-transferable details: Its identity, copy, assets, exact layouts, and gallery-specific data.
- Substitution: CS history becomes the collection; eras become rooms; maps, updates, and tournament moments become artifacts.
- Risk: Copying its theatrical pacing too literally could obscure chronology.
- Guardrail: Dates and chapter labels remain readable before and during motion.

### Runway-inspired cinematic editorial system

- Why it fits: Media-led dark surfaces and interface restraint let historical artifacts carry visual weight.
- Transferable traits: Full-bleed compositions, tight display type, zero drop shadows, cool secondary text, asymmetric editorial media.
- Non-transferable details: AI imagery, Runway typography, company identity, and product modules.
- Substitution: Original/generated Counter-Strike-inspired archival stills and technical textures.
- Risk: Too much full-bleed imagery can feel like a film portfolio.
- Guardrail: Every image is attached to a date, event, or map lineage.

### WIRED-inspired print structure

- Why it fits: Technical mono labels, hard rules, numbered chronology, and typographic hierarchy support historical reading.
- Transferable traits: Mono uppercase kickers, square geometry, hairline rules, number-led lists, and editorial density.
- Non-transferable details: WIRED’s brand typefaces, blue accent, logo, and publication layout.
- Substitution: Hazard-orange proof marks, “FILE / ERA / UPDATE” labels, and tactical coordinate metadata.
- Risk: Dense print patterns can fight cinematic pacing.
- Guardrail: Use print structure inside chapters, not as the page-wide layout.

## 5. Visual Theme & Atmosphere

- Design thesis: “History recovered from the server room.”
- Emotional tone: Reverent, tense, precise, and quietly nostalgic.
- Product personality: Expert fan, not esports advertiser.
- First viewport message: `1999—2023 / COUNTER-STRIKE: THE LONG GAME`.
- Hero focal asset: An original tactical archive composition—dusty topographic layers, orange evidence marks, and a silhouetted counter-terrorist loadout—treated as one cinematic scene.
- Visual weight priorities: Hero title → current era/year → primary artifact → narrative copy → metadata.
- Three.js decision: Use a deferred Three.js shader scene for the opening history runway. A persistent mountainous particle terrain, edge-reaching pressure waves, morphing year glyphs, camera drift, and era-driven color changes carry the spatial motion. The palette moves from radar green through hazard amber to Source 2 cyan. Mobile and reduced-motion paths remove WebGL and reflow all scenes into readable stacked chapters.
- Asset provenance: Generate original hero/chapter visuals for this site; use no copied mesh3d assets. Any historical names/facts are editorial references, not claims of Valve affiliation.

## 6. Color Palette & Roles

- Page/background: `#090A08` soot black.
- Primary surface: `#11120F` charcoal olive.
- Secondary/elevated surface: `#1A1B16`.
- Primary text: `#ECE9DF` bone.
- Secondary text: `#B4B0A5`.
- Muted text: `#858178`.
- Accent/CTA: `#FF5A1F` hazard orange.
- Secondary accent: `#B7C79A` faded radar green, used only for map/technical data.
- Border/divider: `rgba(236, 233, 223, .16)`.
- Focus ring: `#FF8A55`, 2px with offset.
- Semantic colors: success `#9EC86B`, warning `#F6B94A`, error `#EE675C`.
- Constraints: No purple/pink gradients, no glass panels, and no accent text below WCAG AA contrast.

## 7. Typography Rules

- Families: `Archivo Black` for monumental display; `IBM Plex Sans` for reading; `IBM Plex Mono` for archive labels and dates.
- Display/hero: `clamp(4rem, 14vw, 13rem)`, line-height `.78–.86`, uppercase, tight tracking.
- Section headings: `clamp(2.8rem, 8vw, 7rem)`, line-height `.88`.
- Subheadings: 24–36px, medium.
- Body: 16–19px, line-height 1.55–1.7, max 66 characters.
- Labels/captions: 11–13px mono uppercase, letter-spacing `.12em`.
- Weight rules: Display 900; body 400/500; labels 500. Avoid arbitrary bolding.
- Numeric dates use tabular figures.

## 8. Component Styling

- Navigation: Transparent fixed rail with wordmark, chapter index, soundless motion-status indicator, and menu control. It gains a solid soot background after the hero.
- Buttons: Square or 2px radius, 1px bone border, mono uppercase label. Hover inverts to bone/orange; active compresses to `.98`.
- Era index: Number/date labels connected by hairline rules; no card shells.
- Artifact frames: Square crops, no shadows, thin proof-line border, orange registration marks.
- Metadata chips: Not pills; compact rectangular stamps with 1px border.
- Timeline controls: Large hit areas, visible focus, no hover-only information.
- Media: Declared aspect ratios, eager hero, lazy below fold, alt text tied to historical meaning.
- Loading: Static content renders first. Enhancements initialize after fonts/assets; no blocking preloader.

## 9. Layout Principles

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 72, 96, 144px.
- Container: Up to 1600px with fluid 20–64px gutters.
- Grid: 12 columns desktop, 6 tablet, 4 mobile.
- Section sequence:
  1. Hero / “The Long Game”
  2. Origin file / 1999–2000
  3. The versions / 1.6, CZ, Source
  4. Global Offensive / 2012
  5. The living game / updates and competitive eras
  6. Map DNA / Dust II evolution
  7. CS2 / 2023
  8. Legacy statement and sources note
- Rhythm: Alternate immersive viewport scenes with quieter reading bands.
- Mobile: Remove pinned horizontal movement; convert to a vertical evidence trail with swipe-safe controls.

## 10. Depth, Motion, and Interaction

- Motion personality: Mechanical and deliberate—files slide, crop shutters open, dates lock into place.
- Stack: GSAP + ScrollTrigger; Lenis only. CSS handles hover/focus/press.
- Hero intro: Use an asymmetric editorial composition: “Counter” anchors the upper-left edge, “Strike” anchors the lower-right, concise context remains centered, and the interactive terrain carries the depth. The title remains one accessible heading and the cinematic stage does not expose decorative text selection.
- Scroll narrative: One justified pinned timeline with artifact panels translating in depth; all other sections use selective reveals.
- Pointer: Subtle 3–5° artifact tilt on fine pointers only; reset on pointer leave, blur, and visibility change.
- Transitions: 150ms UI feedback; 500–900ms cinematic scene changes; custom eased, interruptible.
- Performance: Transform/opacity/clip-path only; no layout animation; pause offscreen work.
- Reduced motion: No smooth scroll, pinning, scrub, parallax, stagger, or pointer tilt. Render final states immediately.
- Touch: Minimum 44px targets; no interaction depends on hover.

## 11. Do’s and Don’ts

### Do

- Keep dates visible and chronology obvious.
- Let each motion explain a change in era or artifact.
- Use authentic terminology and clearly label editorial approximations.
- Treat mobile as a designed vertical narrative.
- Keep all interactions keyboard-reachable.

### Don’t

- Copy the supplied site’s assets, layout, identity, or source.
- Claim endorsement by Valve, ESL, teams, or players.
- Use fake quotes, fake partners, or invented statistics.
- Add generic RGB glow, glassmorphism, or a grid of rounded cards.
- Animate every section or hide key copy behind JavaScript.

## 12. Implementation Mapping

- New files: Vite scaffold, React page/components, data module, global styles, motion hooks, and generated raster assets.
- Core components: `Header`, `HeroArchive`, `EraRail`, `OriginFile`, `VersionTimeline`, `GlobalOffensive`, `LivingGame`, `MapDNA`, `CS2Transition`, `LegacyFooter`.
- Assets: 1 hero composition plus 4–6 original era/map stills, responsive WebP/AVIF exports with fallbacks.
- Data/copy assumptions: Concise English editorial copy based on widely documented public game history; include a non-affiliation note.

## 13. Evaluation Plan

- Build/typecheck: Production build with zero TypeScript errors.
- Browser/screenshot: Desktop 1440×900 and mobile 375×812.
- Responsive: 320, 375, 768, 1024, 1440, and 1920 widths; no horizontal overflow.
- Accessibility: Keyboard path, visible focus, semantic headings, contrast, alt text, and reduced-motion mode.
- Performance: Production Lighthouse pass; hero motion remains within LCP/TBT/CLS budgets.
- Product fit: A visitor can state the key eras and why they matter after one scroll-through.
- Reference alignment: Similar high-level pacing and dimensionality, materially original identity and composition.
- Generic regression: No stock SaaS cards, fake proof, decorative blobs, or unsupported claims.
