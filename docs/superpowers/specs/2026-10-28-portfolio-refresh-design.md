# Portfolio Refresh Design

## Intent

Turn the current static portfolio into a credible English-language portfolio for international clients while preserving Nguyen Quang Nhat's dark green visual identity. The first showreel is real and remains the primary proof of work. Every replacement project is explicitly identified as illustrative concept work until real client material is available.

## Goals

- Lead with the real showreel, then show selected work before the biography.
- Replace Picsum, Big Buck Bunny, and repeated placeholder project videos with local, lightweight concept media.
- Give project cards an optional 3–5 second muted hover/focus preview on capable desktop devices and a fast click-to-open experience everywhere.
- Present four concise English case studies without fabricated clients, testimonials, logos, or performance metrics.
- Preserve the existing pine-green palette, glow, glass effects, typography, and overall cinematic tone.
- Improve page speed, SEO, keyboard and screen-reader access, reduced-motion behavior, and analytics readiness.

## Non-goals

- Do not change the current contact details or placeholder social contact URLs.
- Do not invent client endorsements, company names, or quantitative outcomes.
- Do not activate analytics without a real measurement identifier.
- Do not add a framework, package manager, build system, or server dependency.

## Content and Layout

The page order becomes: navigation, hero, real showreel, selected concept work, about/skills, process, “What clients can expect,” contact, footer. Project cards carry a visible `Concept Project · Illustrative Content` label and describe the brief, editorial approach, deliverables, and intended outcome in plain English. “What clients can expect” replaces fabricated testimonials with honest service promises.

## Media and Interaction

The showreel YouTube iframe is preserved but created only after the visitor presses Play. Hero motion uses lightweight local visual treatment instead of the external sample video. Four local concept posters and short local preview loops provide a coherent visual system without relying on random stock imagery. Hover/focus previews are enabled only when hover is available and reduced motion is not requested; posters remain the fallback. Project videos open in the existing accessible modal.

## Approaches Considered

1. Static posters only: fastest, but undersells motion-editing capability.
2. Embedded players on every card: immediate motion, but expensive and visually noisy.
3. Hybrid posters plus on-demand previews and players: selected because it demonstrates motion while keeping initial load small.

The existing green visual system is retained rather than redesigned. Local generated concept media is preferred over external stock so the temporary portfolio remains fast, cohesive, and clearly illustrative.

## SEO, Accessibility, and Analytics

Add canonical and complete social metadata, a local social preview image, Person/ProfessionalService structured data, `robots.txt`, and `sitemap.xml`. Add a skip link, semantic labels, visible focus states, dialog semantics and focus management, descriptive media alternatives, reduced-motion handling, and keyboard equivalents for preview behavior. Add a disabled analytics configuration hook that makes no network request until a real provider ID is supplied.

## Acceptance Criteria

- No Picsum or Big Buck Bunny references remain.
- The original showreel URL remains present and loads only after activation.
- Four concept projects are clearly labeled and contain no unsupported claims.
- All initial project imagery and previews are local and have fallbacks.
- Navigation order matches the new content order.
- Keyboard, reduced-motion, and no-hover users can access the same content.
- Automated structural checks, JavaScript syntax checks, local HTTP smoke checks, and desktop/mobile browser checks pass.
- Repository changes are committed and pushed to the GitHub Pages branch when authenticated push access is available.
