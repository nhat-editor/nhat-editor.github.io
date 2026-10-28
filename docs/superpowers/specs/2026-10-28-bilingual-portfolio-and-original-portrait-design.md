# Bilingual Portfolio and Original Portrait — Design

## Intent

Restore Nguyen Quang Nhat's portrait to its original colors and add an English/Vietnamese language switcher. The portfolio remains English-first for international clients while Vietnamese visitors can read the same content without reloading the page.

## Goals

- Remove the color-altering CSS filter from the About portrait while preserving its crop, border, layout, and the site's pine-green visual identity elsewhere.
- Add an accessible `EN | VI` switcher to both desktop and mobile navigation.
- Keep English as the first-visit default.
- Translate all visitor-facing portfolio copy, navigation labels, buttons, concept disclosures, modal labels, and relevant accessibility text.
- Switch content instantly in the browser, update the document language, and remember the visitor's choice locally.
- Preserve all current media behavior, responsive layout, SEO structure, contact details, and green styling.

## Non-goals

- No separate `/vi/` page or independently indexed Vietnamese URL.
- No automatic language selection based on browser locale.
- No changes to contact information, project media, showreel, or overall section order.
- No removal of the existing green visual effects outside the portrait image.

## Constraints and behavior

- First visit defaults to English regardless of browser language.
- A saved language choice is restored on later visits.
- The selected language is visually and programmatically indicated.
- The switch remains usable with keyboard and screen readers.
- If JavaScript is unavailable, the complete English portfolio remains visible.
- Temporary projects continue to be clearly disclosed as `Concept Project · Illustrative Content` in English and an equivalent explicit disclosure in Vietnamese.

## Approaches considered

1. **One-page JavaScript dictionary — selected.** Fast switching, no duplicated pages, and easy maintenance for the current static portfolio. English remains the primary SEO language.
2. **Separate `/` and `/vi/` pages.** Better independent indexing, but duplicates markup and increases maintenance for a portfolio that changes frequently.
3. **Automatic browser-language detection.** Convenient for some visitors, but can unexpectedly replace the international-facing English version and conflicts with the English-first goal.

## Implementation direction

- Use stable translation keys in the existing HTML and a small English/Vietnamese dictionary in the existing JavaScript.
- Change text and accessibility attributes through one language controller; set `<html lang>` to `en` or `vi` and persist the choice with local storage.
- Add the control using the existing navigation style so it feels native to the current design.
- Remove only `grayscale(20%) sepia(10%) hue-rotate(90deg)` from the portrait rule; retain size and positioning rules.
- Extend automated checks for default English, Vietnamese switching, persistence, document language, mobile control visibility, keyboard access, and the absence of portrait color filters.

## Acceptance criteria

- The About portrait uses the original file colors on desktop and mobile.
- English is shown on a clean first visit.
- Switching to Vietnamese updates all scoped text without a reload and changes the document language to `vi`.
- Reloading restores the previously selected language.
- Both language controls remain accessible and synchronized.
- Existing showreel, hover previews, project modal, menu, responsive layout, and reduced-motion behavior still pass their tests.
- The verified changes are committed and pushed to GitHub `master`, then checked on the live GitHub Pages site.
