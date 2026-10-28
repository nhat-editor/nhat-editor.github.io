# Avatar Web Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 18.9 MB About portrait PNG with a visually faithful WebP no larger than 100 KB so it appears promptly when visitors reach the section.

**Architecture:** Produce one 1200×1440 WebP from the committed source using ImageMagick quality 82, then update the About markup and JSON-LD to reference only that file. Preserve below-the-fold lazy loading and add asynchronous decoding; static and browser checks protect size, dimensions, references, color treatment, and existing behavior.

**Tech Stack:** Static HTML/CSS, ImageMagick, WebP, Node.js built-in test runner, Chromium browser tests

**Spec:** `docs/superpowers/specs/2026-10-28-avatar-web-optimization-design.md`

## Global Constraints

- Output `assets/avatar.webp` at exactly 1200×1440, WebP quality 82, and no larger than 100 KB.
- Preserve the portrait's natural colors, visible crop, alt text, bilingual behavior, and current About layout.
- Keep `loading="lazy"` and add `decoding="async"`.
- Update both About markup and JSON-LD; production files must not reference `assets/avatar.png`.
- Remove `assets/avatar.png` only after visual and automated verification; do not rewrite Git history.

## Review Focus

- WebP encoding can introduce visible skin-tone banding or softened facial detail; Task 2 requires direct visual comparison at rendered scale.
- Incorrect intrinsic dimensions can change crop or layout stability; Task 2 asserts 1200×1440 metadata and browser-rendered containment.
- A stale JSON-LD or HTML reference can still request the 18.9 MB PNG; Task 2 scans production references.
- Removing the PNG before confirming the WebP can leave the site without a portrait; Task 2 orders generation and verification before removal.
- GitHub Pages must serve the WebP path after push; Task 3 verifies the remote commit and attempts a public HTTP smoke check.

---

### Task 1: Commit the approved optimization documents

**Files:**
- Create: `docs/superpowers/specs/2026-10-28-avatar-web-optimization-design.md`
- Create: `docs/superpowers/plans/2026-10-28-avatar-web-optimization.md`

**Interfaces:**
- Consumes: User-approved single-WebP design.
- Produces: Durable conversion parameters and acceptance criteria for Task 2.

- [ ] **Step 1: Verify only the two approved documents are untracked**

Run: `git status --short`
Expected: the spec and plan appear with `??`, with no unrelated changes.

- [ ] **Step 2: Commit the documents**

```bash
git add docs/superpowers/specs/2026-10-28-avatar-web-optimization-design.md docs/superpowers/plans/2026-10-28-avatar-web-optimization.md
git commit -m "docs: plan avatar web optimization"
```

### Task 2: Generate and integrate the optimized portrait

**Files:**
- Create: `assets/avatar.webp`
- Delete: `assets/avatar.png`
- Modify: `index.html:37,148`
- Modify: `tests/site-check.mjs`
- Test: `tests/browser-check.mjs`

**Interfaces:**
- Consumes: `assets/avatar.png` and the accepted 1200×1440, quality-82 conversion parameters.
- Produces: `assets/avatar.webp`, referenced by About and JSON-LD, with correct intrinsic metadata and unchanged CSS crop behavior.

- [ ] **Step 1: Write the failing asset and browser tests**

Add `optimized portrait is a compact WebP used everywhere` to `tests/site-check.mjs`. Assert the new file exists, ImageMagick reports `WEBP 1200x1440`, file size is between 10 KB and 100 KB, About markup includes `src="assets/avatar.webp"`, `width="1200"`, `height="1440"`, `loading="lazy"`, and `decoding="async"`, JSON-LD uses the absolute WebP URL, and no production HTML/CSS/JS reference contains `avatar.png`.

Add `optimized portrait loads at its intrinsic size without a color filter` to `tests/browser-check.mjs`. Scroll the About image into view, wait for it to complete, then assert `naturalWidth === 1200`, `naturalHeight === 1440`, `currentSrc` ends in `/assets/avatar.webp`, and computed `filter === "none"`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test --test-name-pattern="optimized portrait" tests/site-check.mjs` and `node --test --test-name-pattern="optimized portrait" tests/browser-check.mjs`
Expected: both FAIL because `assets/avatar.webp` does not exist and the browser still loads the 2290×2748 PNG.

- [ ] **Step 3: Generate the WebP without modifying the source**

Run: `convert assets/avatar.png -resize '1200x1440>' -quality 82 assets/avatar.webp`
Expected: `identify assets/avatar.webp` reports WebP at 1200×1440 and `stat` reports no more than 100 KB.

- [ ] **Step 4: Visually compare source and WebP**

Inspect both files at high detail. Confirm natural colors, face shape, eye/hair detail, and background crop remain acceptable; if the 82-quality output is visibly degraded, stop and rule on the smallest quality increase that stays below 100 KB.

- [ ] **Step 5: Update production references and intrinsic metadata**

Change the JSON-LD image to `https://nhat-editor.github.io/assets/avatar.webp`. Change the About image to `src="assets/avatar.webp" width="1200" height="1440" loading="lazy" decoding="async"`; preserve its alt and translation attributes.

- [ ] **Step 6: Remove the current-tree PNG after references are updated**

Run: `git rm assets/avatar.png`
Expected: Git stages the exact old PNG for deletion; recovery remains possible from commit history.

- [ ] **Step 7: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="optimized portrait" tests/site-check.mjs
node --check script.js
node --test tests/site-check.mjs
node --test tests/browser-check.mjs
```

Expected: focused test and every suite pass; browser About image has a nonzero natural width and computed filter `none`.

- [ ] **Step 8: Commit the optimized portrait**

```bash
git add assets/avatar.webp index.html tests/site-check.mjs tests/browser-check.mjs
git commit -m "perf: optimize portfolio portrait"
```

### Task 3: Review, publish, and verify

**Files:**
- Verify: all files changed from the pre-task base through `HEAD`

**Interfaces:**
- Consumes: Verified WebP integration from Task 2.
- Produces: Reviewed commit on GitHub `master` with remote and best-effort live verification.

- [ ] **Step 1: Run final verification**

Run: `node --check script.js`, both complete Node test files, and `git diff --check origin/master..HEAD`.
Expected: syntax exits 0, all tests pass, and diff check prints nothing.

- [ ] **Step 2: Request read-only whole-range code review**

Review asset dimensions/size, reference completeness, accessibility attributes, deletion safety, and regressions. Fix any Critical or Important finding with a failing test before code.

- [ ] **Step 3: Push the verified branch to GitHub `master`**

Run: `git push origin HEAD:master`
Expected: remote `master` advances without force.

- [ ] **Step 4: Verify publication evidence**

Confirm `git ls-remote origin refs/heads/master` equals local `HEAD`. Attempt HTTP checks for `/`, `/assets/avatar.webp`, and absence of the old production reference; if the environment proxy blocks GitHub Pages, report that limitation explicitly instead of claiming a live check.
