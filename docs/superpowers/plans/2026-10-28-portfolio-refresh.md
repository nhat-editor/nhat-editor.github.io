# Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the static portfolio with honest concept work, fast motion previews, stronger conversion structure, and production-ready SEO/accessibility while preserving its green visual identity.

**Architecture:** Keep the dependency-free HTML/CSS/JavaScript site. Store generated concept posters and short previews under `assets/`, defer all heavyweight embeds until interaction, and validate structural requirements through a Node test plus real browser smoke checks.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js built-ins for tests, FFmpeg/ImageMagick for generated media, Python static server, headless Chromium.

**Spec:** `docs/superpowers/specs/2026-10-28-portfolio-refresh-design.md`

## Global Constraints

- Preserve the pine-green palette, glow, glass effects, typography, and cinematic tone.
- Keep the first showreel URL and treat it as real work.
- Label every temporary project `Concept Project · Illustrative Content`.
- Do not change contact details or placeholder social-contact URLs.
- Do not invent clients, testimonials, logos, or quantitative results.
- Do not enable analytics without a real measurement ID.
- Add no package manager, framework, or build dependency.

## Review Focus

- Reduced-motion users must receive static posters and no forced smooth scrolling or preview playback; cover in the structural test and browser evaluation.
- Touch/no-hover users must open projects with one activation and never depend on hover; cover in DOM assertions and mobile Chromium smoke testing.
- Failed preview media must leave the poster and project button usable; cover with a missing-media browser test.
- Dialog focus must move into the modal and return to the triggering button on close; cover with a keyboard browser test.
- An empty analytics ID must produce no analytics request or runtime error; cover in the structural test and browser console check.

---

### Task 1: Regression checks and local concept media

**Files:**
- Create: `tests/site-check.mjs`
- Create: `scripts/generate-concept-media.sh`
- Create: `assets/concepts/*.svg`
- Create: `assets/concepts/*.webm`
- Create: `assets/social-preview.svg`

**Interfaces:**
- Produces: local poster paths `assets/concepts/<slug>.svg`, preview paths `assets/concepts/<slug>-preview.webm`, and a dependency-free structural test command `node tests/site-check.mjs`.

- [ ] **Step 1: Write failing structural assertions**

Assert required concept labels/local media paths, retained showreel ID, absence of Picsum/Big Buck Bunny, project count, metadata, skip link, dialog semantics, reduced-motion CSS, and inactive analytics configuration.

- [ ] **Step 2: Run the test and confirm the current site fails**

Run: `node tests/site-check.mjs`

Expected: non-zero exit identifying placeholder media and missing new structure.

- [ ] **Step 3: Add reproducible concept-media generation**

Create four 16:9 SVG posters in the existing green visual language and a script that uses FFmpeg to turn each poster into a silent 3–5 second VP9 WebM loop with subtle motion. Generate a local 1200×630 social preview.

- [ ] **Step 4: Verify generated assets**

Run: `ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 assets/concepts/*-preview.webm`

Expected: each preview is 3–5 seconds, readable, and compact.

### Task 2: Reorder and rewrite portfolio content

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: concept poster/preview paths from Task 1.
- Produces: `.work-card[data-preview]`, `.concept-label`, `.case-study`, `.client-expectations`, and the reordered document landmarks used by Task 3.

- [ ] **Step 1: Reorder page landmarks and navigation**

Place selected work directly after the showreel, then about, process, client expectations, and contact. Update desktop/mobile navigation to match.

- [ ] **Step 2: Replace placeholder media and copy**

Remove Picsum and Big Buck Bunny, preserve the real showreel ID, attach local posters/previews, and write four English concept case studies with brief, approach, deliverables, and intended outcome.

- [ ] **Step 3: Add honest social proof**

Add `What clients can expect` cards for clear communication, organized delivery, and story-first editing; use no quoted people or company marks.

- [ ] **Step 4: Preserve and extend green styling**

Style concept labels, preview states, case-study details, expectation cards, skip link, and focus states using existing CSS variables. Keep responsive behavior at 768px and add reduced-motion rules.

- [ ] **Step 5: Run structural checks**

Run: `node tests/site-check.mjs`

Expected: content/media assertions pass; interaction assertions may remain pending until Task 3.

### Task 3: On-demand video and accessible interaction

**Files:**
- Modify: `script.js`
- Modify: `index.html`
- Modify: `style.css`
- Test: `tests/site-check.mjs`

**Interfaces:**
- Consumes: `.work-card[data-preview]`, project buttons, showreel trigger, and `#modal` from Task 2.
- Produces: `initPreviewCards()`, `loadShowreel()`, `openModal(videoUrl, title, trigger)`, `closeModal()`, and an inert analytics helper that does not request data without an ID.

- [ ] **Step 1: Extend failing assertions for lazy embeds and accessibility hooks**

Assert the initial showreel has no iframe `src`, project previews are muted/looping/lazy, dialog labels exist, and analytics ID is empty.

- [ ] **Step 2: Implement capability-aware preview playback**

Load and play previews only for hover-capable, non-reduced-motion users on pointer/focus entry; pause and reset on exit; preserve posters when playback rejects or media errors.

- [ ] **Step 3: Lazy-load the showreel and project players**

Create iframe URLs only on activation, add a loading state, and prevent duplicate query parameters.

- [ ] **Step 4: Complete dialog keyboard and focus behavior**

Move focus to the close control, trap Tab within the active dialog, close on Escape/backdrop, restore the trigger focus, and update `aria-hidden` consistently.

- [ ] **Step 5: Add analytics readiness without tracking**

Define an empty measurement ID and a guarded `trackEvent(name, params)` interface; call it for showreel/project/contact actions only when configured.

- [ ] **Step 6: Verify JavaScript and structural behavior**

Run: `node --check script.js && node tests/site-check.mjs`

Expected: both exit 0.

### Task 4: SEO files and end-to-end validation

**Files:**
- Modify: `index.html`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Test: `tests/site-check.mjs`

**Interfaces:**
- Produces: canonical/social metadata and valid Person/ProfessionalService JSON-LD for `https://nhat-editor.github.io/`.

- [ ] **Step 1: Add complete metadata and structured data**

Use the canonical URL, local social preview, English locale, theme color, descriptive title/description, and JSON-LD without unsupported claims.

- [ ] **Step 2: Add crawler files**

Create `robots.txt` pointing to `https://nhat-editor.github.io/sitemap.xml` and a one-page sitemap containing the canonical URL.

- [ ] **Step 3: Run automated checks and local HTTP smoke test**

Run: `node --check script.js && node tests/site-check.mjs`, then serve with `python3 -m http.server 8000 --bind 127.0.0.1` and request `/`, `/style.css`, `/script.js`, `/robots.txt`, `/sitemap.xml`, and every local media asset.

Expected: all checks and HTTP requests exit 0.

- [ ] **Step 4: Run desktop/mobile Chromium checks**

Verify title/content, four cards, lazy showreel creation, preview fallback, modal focus restoration, keyboard close, reduced-motion behavior, and 390px responsive layout. Capture console and failed local requests; expected: no JavaScript errors or failed local resources.

- [ ] **Step 5: Review repository diff**

Run: `git diff --check && git status --short && git diff --stat`

Expected: only planned source, docs, tests, scripts, and generated media are changed.

- [ ] **Step 6: Commit and push**

Commit the verified changes with `feat: refresh video editor portfolio`, recheck the remote/default GitHub Pages branch, then push without force. If authentication or branch protection blocks the push, preserve the local commit and report the exact blocker.
