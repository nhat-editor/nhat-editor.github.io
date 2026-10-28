# Avatar Web Optimization — Design

## Intent

Make the About portrait appear promptly without changing its original colors or visible composition. Replace the 18.9 MB, 2290×2748 PNG used by the website with a web-sized WebP.

## Goals

- Generate `assets/avatar.webp` at 1200×1440 with WebP quality 82.
- Preserve the source image's natural colors and sufficient facial detail for the largest rendered About layout.
- Update the About image and JSON-LD image URL to the WebP asset.
- Keep lazy loading because the About section is below the initial viewport, and add asynchronous decoding.
- Remove `assets/avatar.png` from the current tree after the WebP is verified; Git history remains the recovery source.
- Preserve the current crop, layout, alt text, bilingual behavior, and pine-green site styling.

## Non-goals

- Do not alter the portrait artistically, retouch the face, recolor it, or change the About layout.
- Do not rewrite Git history to purge the old PNG from previous commits.
- Do not introduce a responsive image set; the measured 1200 px WebP is already approximately 40 KB.

## Approaches considered

1. **Single 1200×1440 WebP — selected.** Very small, visually sufficient, simple markup, and broadly supported.
2. **Responsive 800/1200 WebP set.** Saves roughly another 16 KB on mobile but adds markup and maintenance for negligible practical benefit.
3. **Compressed PNG.** Retains the format but remains substantially heavier and does not address the loading problem as effectively.

## Acceptance criteria

- `assets/avatar.webp` is 1200×1440, valid WebP, and no larger than 100 KB.
- The optimized portrait retains its original colors and looks acceptable at the About section's rendered size.
- Production HTML and structured data reference only `assets/avatar.webp`, not `assets/avatar.png`.
- The portrait retains `loading="lazy"` and uses `decoding="async"`.
- The old PNG is absent from the current tree but remains recoverable from Git history.
- All existing static and browser tests pass, the change is committed, pushed to `master`, and the remote commit is verified.
