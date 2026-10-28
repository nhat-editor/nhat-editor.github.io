# Bilingual Portfolio and Original Portrait Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the About portrait's original colors and add a persistent, accessible English/Vietnamese switcher to the existing static portfolio.

**Architecture:** Keep complete English content in HTML as the no-JavaScript and SEO baseline. Mark translatable text and attributes with stable keys, then use a small dictionary and one language controller in `script.js` to apply Vietnamese, synchronize both controls, update `<html lang>`, and persist the choice safely.

**Tech Stack:** Static HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner, Chromium DevTools Protocol browser tests

**Spec:** `docs/superpowers/specs/2026-10-28-bilingual-portfolio-and-original-portrait-design.md`

## Global Constraints

- English is the first-visit default regardless of browser locale.
- Keep the full English portfolio readable when JavaScript is unavailable.
- Do not create a separate `/vi/` page or automatically select Vietnamese.
- Preserve contact data, project media, showreel behavior, section order, responsive layout, and all pine-green styling outside the portrait.
- Translate all visitor-facing copy and relevant accessibility text; keep technology and product names unchanged when that is natural.
- Keep `Concept Project · Illustrative Content` explicit in English and use `Dự án ý tưởng · Nội dung minh họa` in Vietnamese.
- Use `localStorage` key `portfolio-language`, accepting only `en` and `vi`; storage failures must not break the page.

## Review Focus

- A missing, corrupt, or unsupported saved language must resolve to English without throwing; Task 4 browser tests pin this behavior.
- Browsers that deny `localStorage` access must still render and switch languages for the current page session; Task 4 browser tests inject this condition.
- Menu open/close labels and dynamically created media titles must use the currently active language; Task 4 browser tests exercise both dynamic paths.
- Every `data-i18n` key in the DOM must exist in both dictionaries, with English HTML remaining complete; Task 3 static tests enforce dictionary/markup coverage.
- At 390 px, controls and translated Vietnamese copy must not cause horizontal overflow or hide the menu control; Task 5 extends the mobile regression test.

---

### Task 1: Commit the approved design and implementation plan

**Files:**
- Create: `docs/superpowers/specs/2026-10-28-bilingual-portfolio-and-original-portrait-design.md`
- Create: `docs/superpowers/plans/2026-10-28-bilingual-portfolio-and-original-portrait.md`

**Interfaces:**
- Consumes: The user-approved one-page English/Vietnamese design.
- Produces: The durable requirements and task sequence used by every later task.

- [ ] **Step 1: Verify both documents are tracked as new files**

Run: `git status --short`
Expected: both document paths appear with `??` and no unrelated changes appear.

- [ ] **Step 2: Commit the approved documents**

```bash
git add docs/superpowers/specs/2026-10-28-bilingual-portfolio-and-original-portrait-design.md docs/superpowers/plans/2026-10-28-bilingual-portfolio-and-original-portrait.md
git commit -m "docs: plan bilingual portfolio update"
```

### Task 2: Restore original portrait colors

**Files:**
- Modify: `style.css:293-298`
- Test: `tests/site-check.mjs`

**Interfaces:**
- Consumes: Existing `.about-img img` layout rule and `assets/avatar.png`.
- Produces: A portrait rule containing sizing/cropping only, with no color-changing `filter` declaration.

- [ ] **Step 1: Write the failing static test**

Add test `about portrait preserves the source image colors` that extracts the `.about-img img` rule, asserts it still contains `object-fit: cover`, and asserts it contains neither `filter:` nor `hue-rotate`, `sepia`, or `grayscale`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test --test-name-pattern="about portrait" tests/site-check.mjs`
Expected: FAIL because the current rule includes `filter: grayscale(20%) sepia(10%) hue-rotate(90deg)`.

- [ ] **Step 3: Remove only the portrait color filter**

Edit `.about-img img` in `style.css` so it retains `width`, `height`, and `object-fit: cover`, but has no `filter` declaration. Do not change green effects on other selectors.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `node --test --test-name-pattern="about portrait" tests/site-check.mjs`
Expected: PASS.

- [ ] **Step 5: Commit the portrait correction**

```bash
git add style.css tests/site-check.mjs
git commit -m "fix: restore original portrait colors"
```

### Task 3: Add the bilingual markup contract and controls

**Files:**
- Modify: `index.html:55-178`
- Modify: `style.css:135-177,445-458`
- Modify: `tests/site-check.mjs`

**Interfaces:**
- Consumes: Existing English HTML, desktop navigation, mobile menu, and current design tokens.
- Produces: Stable `data-i18n` keys; `data-i18n-attr` mappings for `aria-label`, `alt`, `title`, and `data-title`; two controls containing buttons with `data-language="en|vi"`.

- [ ] **Step 1: Write failing static contract tests**

Add tests named `language controls are available in desktop and mobile navigation` and `translation markup preserves English as the complete baseline`. Assert:

- exactly two `.language-switch` groups exist;
- each group has `EN` and `VI` buttons with `type="button"` and `data-language`;
- English buttons start with `aria-pressed="true"` and Vietnamese buttons with `false`;
- essential copy nodes (skip link, navigation, hero, every section heading, concept disclosure, actions, footer) have stable `data-i18n` keys while retaining non-empty English text;
- visitor-facing `aria-label`, `alt`, iframe `title`, and project `data-title` values declare `data-i18n-attr` mappings.

- [ ] **Step 2: Run focused tests and verify they fail**

Run: `node --test --test-name-pattern="language controls|translation markup" tests/site-check.mjs`
Expected: FAIL because the controls and translation attributes do not exist.

- [ ] **Step 3: Add semantic translation markers and both controls**

Add English-baseline `data-i18n` keys across `index.html`. Use separate spans around text interrupted by `<strong>`, `<br>`, icons, or emphasized content so the controller can use `textContent` without replacing markup. Add desktop and mobile `role="group"` language controls labeled through `data-i18n-attr="aria-label:language.label"`.

- [ ] **Step 4: Style controls using existing design tokens**

Add `.language-switch` styles using `--border`, `--accent`, `--accent-glow`, and `--ink-dim`; style `[aria-pressed="true"]` as active. Keep the desktop control beside the navigation and the mobile version inside the menu. Ensure visible keyboard focus and no breakpoint change outside navigation.

- [ ] **Step 5: Run focused static tests and verify they pass**

Run: `node --test --test-name-pattern="language controls|translation markup" tests/site-check.mjs`
Expected: PASS.

- [ ] **Step 6: Commit the markup contract**

```bash
git add index.html style.css tests/site-check.mjs
git commit -m "feat: add bilingual portfolio controls"
```

### Task 4: Implement safe language switching and persistence

**Files:**
- Modify: `script.js:1-56,120-138,181-231`
- Modify: `tests/site-check.mjs`
- Modify: `tests/browser-check.mjs`

**Interfaces:**
- Consumes: `data-i18n`, `data-i18n-attr`, and `[data-language]` elements from Task 3.
- Produces: `translations: Record<'en'|'vi', Record<string,string>>`, `translate(key: string, language?: 'en'|'vi'): string`, `getSavedLanguage(): 'en'|'vi'`, and `applyLanguage(language: string, options?: { persist?: boolean }): void`.

- [ ] **Step 1: Write failing dictionary coverage tests**

Add static test `both language dictionaries cover every markup key` that extracts DOM keys and verifies each appears in both `translations.en` and `translations.vi`. It must also assert the exact Vietnamese disclosure `Dự án ý tưởng · Nội dung minh họa` exists and that `portfolio-language` is the storage key.

- [ ] **Step 2: Write failing browser behavior tests**

Add browser tests for:

- clean storage starts in English with `<html lang="en">`;
- keyboard activation of a `VI` button changes representative hero, section, concept, action, and accessibility strings and synchronizes all four buttons' `aria-pressed` values;
- reload restores Vietnamese;
- unsupported stored value falls back to English;
- injected `localStorage` read/write failures do not stop switching within the current page;
- opening/closing the mobile menu and creating the showreel iframe use current-language labels/titles.

Each test must restore English or clear its injected browser state so existing tests remain independent.

- [ ] **Step 3: Run focused tests and verify they fail**

Run: `node --test --test-name-pattern="language dictionaries" tests/site-check.mjs && node --test --test-name-pattern="language" tests/browser-check.mjs`
Expected: FAIL because no dictionary or controller exists.

- [ ] **Step 4: Add dictionaries and language controller**

In `script.js`, define the exact interfaces above. `applyLanguage` must:

- normalize unknown values to `en`;
- update text with `textContent` and only the declared attributes from `data-i18n-attr`;
- set `document.documentElement.lang`;
- synchronize every `[data-language]` button using `aria-pressed`;
- persist inside `try/catch` only when `options.persist !== false`;
- retain English when a translation key is missing rather than blanking content.

Initialize from `getSavedLanguage()` before attaching button listeners.

- [ ] **Step 5: Route dynamic interface strings through `translate`**

Update `setMenuOpen`, `loadShowreel`, and the default modal title to call `translate` for open/close menu labels, the showreel iframe title, and `Project preview`. Do not change media-loading behavior.

- [ ] **Step 6: Run focused tests and verify they pass**

Run: `node --test --test-name-pattern="language dictionaries" tests/site-check.mjs && node --test --test-name-pattern="language" tests/browser-check.mjs`
Expected: PASS.

- [ ] **Step 7: Commit the language controller**

```bash
git add script.js tests/site-check.mjs tests/browser-check.mjs
git commit -m "feat: localize portfolio in English and Vietnamese"
```

### Task 5: Verify regressions, responsive behavior, and publication

**Files:**
- Modify: `tests/browser-check.mjs`
- Verify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: Completed portrait and bilingual implementation.
- Produces: Verified local and live behavior on GitHub Pages.

- [ ] **Step 1: Extend the mobile regression test and verify it fails if coverage is missing**

Update `390px mobile layout has no horizontal overflow and exposes the menu control` to switch to Vietnamese, open the menu, and assert: page width does not exceed 390 px, the mobile language group is visible, the menu toggle remains visible, and Vietnamese navigation text is rendered.

- [ ] **Step 2: Run all syntax, static, and browser tests**

Run:

```bash
node --check script.js
node --test tests/site-check.mjs
node --test tests/browser-check.mjs
git diff --check origin/master..HEAD
```

Expected: all tests PASS, syntax check exits 0, and diff check prints nothing.

- [ ] **Step 3: Inspect both languages at desktop and 390 px**

Serve the repository locally, capture or inspect English and Vietnamese in Chromium, and confirm the portrait uses its source colors, green site styling remains intact, controls do not overlap, Vietnamese text wraps cleanly, and existing previews/modal still work.

- [ ] **Step 4: Request final code review and address only verified findings**

Review changes from the pre-task base through `HEAD`, focusing on translation completeness, storage failure safety, accessibility state, dynamic labels, responsive overflow, and regressions to media behavior.

- [ ] **Step 5: Commit any verified review fixes and rerun Step 2**

Use a scoped fix commit only if review identifies a reproducible issue. Expected after rerun: every command passes again.

- [ ] **Step 6: Push the verified branch to GitHub `master`**

Run: `git push origin HEAD:master`
Expected: remote reports `master` updated without force.

- [ ] **Step 7: Verify the deployed GitHub Pages site**

Poll `https://nhat-editor.github.io/` until the deployed commit marker is present, then verify the live HTML/CSS/JS return HTTP 200 and the language controls, exact Vietnamese concept disclosure, and filter-free portrait rule are deployed.
