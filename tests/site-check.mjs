import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const conceptSlugs = [
  "finance-explainer",
  "saas-launch",
  "property-story",
  "social-campaign",
];

const html = readFileSync("index.html", "utf8");
const normalizedHtml = html.replace(/\s+/g, " ");
const script = readFileSync("script.js", "utf8");
const stylesheet = readFileSync("style.css", "utf8");

test("each concept project ships a local poster and a compact 3–5 second preview", () => {
  for (const slug of conceptSlugs) {
    const poster = `assets/concepts/${slug}.svg`;
    const preview = `assets/concepts/${slug}-preview.webm`;

    assert.ok(statSync(poster).size > 1_000, `${poster} should contain original artwork`);
    assert.ok(statSync(preview).size > 5_000, `${preview} should contain encoded motion`);

    const duration = Number(execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      preview,
    ], { encoding: "utf8" }).trim());

    assert.ok(duration >= 3 && duration <= 5, `${preview} duration was ${duration}`);
  }
});

test("the social preview is a local 1200×630 branded asset", () => {
  const path = "assets/social-preview.svg";
  assert.ok(statSync(path).size > 1_000);
  const source = execFileSync("sed", ["-n", "1,3p", path], { encoding: "utf8" });
  assert.match(source, /width="1200"/);
  assert.match(source, /height="630"/);
});

test("selected work follows the real showreel and precedes the biography", () => {
  const showreel = html.indexOf('id="showreel"');
  const work = html.indexOf('id="work"');
  const about = html.indexOf('id="about"');
  assert.ok(showreel > -1 && showreel < work && work < about);
});

test("about portrait preserves the source image colors", () => {
  const rule = stylesheet.match(/\.about-img img\s*\{([^}]+)\}/)?.[1] ?? "";

  assert.match(rule, /object-fit:\s*cover/);
  assert.doesNotMatch(rule, /filter\s*:|hue-rotate|sepia|grayscale/);
});

test("optimized portrait is a compact WebP used everywhere", () => {
  const portrait = "assets/avatar.webp";
  assert.equal(existsSync(portrait), true, `${portrait} should exist`);
  const image = readFileSync(portrait);
  assert.equal(image.toString("ascii", 0, 4), "RIFF");
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.ok(statSync(portrait).size >= 10_000 && statSync(portrait).size <= 100_000);
  assert.match(html, /"image": "https:\/\/nhat-editor\.github\.io\/assets\/avatar\.webp"/);
  assert.match(html, /<img src="assets\/avatar\.webp"[^>]+width="1122"[^>]+height="1402"[^>]+loading="lazy"[^>]+decoding="async"/);
  assert.doesNotMatch(`${html}\n${stylesheet}\n${script}`, /assets\/avatar\.png/);
});

test("language controls are available in header navigation", () => {
  assert.equal((html.match(/class="language-switch(?: [^"]+)?"/g) ?? []).length, 1);
  assert.equal((html.match(/type="button" data-language="en" aria-pressed="true"/g) ?? []).length, 1);
  assert.equal((html.match(/type="button" data-language="vi" aria-pressed="false"/g) ?? []).length, 1);
  assert.equal((normalizedHtml.match(/role="group"[^>]+data-i18n-attr="aria-label:language\.label"/g) ?? []).length, 1);
});

test("translation markup preserves English as the complete baseline", () => {
  const essentialText = {
    "skip.content": "Skip to content",
    "nav.showreel": "Showreel",
    "nav.work": "Work",
    "nav.about": "About",
    "nav.process": "Process",
    "nav.why": "Why Me",
    "nav.contact": "Contact",
    "hero.kicker": "Portfolio · Available worldwide",
    "hero.watch": "Watch Showreel",
    "hero.start": "Start a Project",
    "showreel.title": "Featured Showreel",
    "work.title": "Editing Scenarios",
    "work.previewAction": "View Motion Preview",
    "about.title.first": "Story first,",
    "process.title": "A clear path from brief to delivery",
    "expectations.title": "What clients can expect",
    "contact.title.first": "Let’s bring your",
    "footer.top": "Back to top ↑",
  };

  for (const [key, copy] of Object.entries(essentialText)) {
    assert.match(normalizedHtml, new RegExp(`data-i18n="${key}"[^>]*>${copy.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`));
  }

  for (const mapping of ["aria-label:", "alt:", "title:", "data-title:"]) {
    assert.match(normalizedHtml, new RegExp(`data-i18n-attr="[^"]*${mapping}`));
  }
});

test("both language dictionaries cover every markup key", () => {
  const textKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
  const attributeKeys = [...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((match) => (
    match[1].split(";").map((mapping) => mapping.slice(mapping.indexOf(":") + 1))
  ));
  const keys = new Set([...textKeys, ...attributeKeys]);
  const prefix = "const translations = ";
  const start = script.indexOf(prefix);
  const end = script.indexOf("\n\nconst SUPPORTED_LANGUAGES", start);

  assert.notEqual(start, -1, "script should define translations");
  assert.notEqual(end, -1, "translation dictionary should end before supported languages");
  const literal = script.slice(start + prefix.length, end).trim().replace(/;$/, "");
  const translations = runInNewContext(`(${literal})`);

  for (const language of ["en", "vi"]) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], "string", `${language}.${key} should exist`);
      assert.ok(translations[language][key].length > 0, `${language}.${key} should not be empty`);
    }
  }
  assert.equal(translations.vi["footer.copyright"], "© 2026 Nguyen Quang Nhat. Bảo lưu mọi quyền.");
  assert.match(script, /const LANGUAGE_STORAGE_KEY = "portfolio-language";/);
});

test("four work cards use local poster assets without placeholder media", () => {
  assert.equal((html.match(/class="work-card"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /picsum\.photos|BigBuckBunny|aqz-KE-bpKQ|img\.youtube\.com/);
  for (const poster of ["assets/work-anim1.webp", "assets/work-talking-head.webp", "assets/work-documentary.webp", "assets/concepts/social-campaign.svg"]) {
    assert.equal(existsSync(poster), true, `${poster} should exist`);
    assert.match(html, new RegExp(poster.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("concept copy avoids fabricated proof and sets an intended outcome", () => {
  assert.equal((html.match(/class="case-study"/g) ?? []).length, 4);
  assert.equal((html.match(/Intended outcome:/g) ?? []).length, 4);
  assert.doesNotMatch(html, /Happy Clients|Videos Delivered|150\+|40\+/);
});

test("social proof is framed as service expectations rather than testimonials", () => {
  assert.match(html, /id="expectations"/);
  assert.match(normalizedHtml, /What clients can expect/);
  assert.doesNotMatch(html, /testimonials-swiper|client-logo/);
});

test("heavy video media is deferred until visitor interaction", () => {
  assert.match(html, /data-showreel-src="https:\/\/www\.youtube\.com\/embed\/BeYzqS5ig2o"/);
  assert.doesNotMatch(html, /<iframe[^>]+src=/);
  assert.equal((normalizedHtml.match(/<video class="work-preview" muted loop playsinline preload="none"/g) ?? []).length, 1);
  assert.equal((html.match(/<source data-src="assets\/concepts\/.+-preview\.webm"/g) ?? []).length, 1);
});

test("modal markup exposes an accessible dialog and both media modes", () => {
  assert.match(html, /id="modal" role="dialog" aria-modal="true" aria-hidden="true"/);
  assert.match(html, /id="modalVideo" controls playsinline preload="none"/);
  assert.match(html, /id="modalIframe" title="Project video"/);
});

test("reduced motion and analytics defaults are privacy-safe", () => {
  assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(script, /const ANALYTICS_MEASUREMENT_ID = "";/);
  assert.doesNotMatch(html, /googletagmanager|plausible|analytics\.js/);
});

test("SEO metadata uses absolute canonical and social URLs", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/nhat-editor\.github\.io\/"/);
  assert.match(html, /<meta property="og:url" content="https:\/\/nhat-editor\.github\.io\/"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/nhat-editor\.github\.io\/assets\/social-preview\.png"/);
  assert.match(html, /<meta property="og:locale" content="en_US"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
});

test("structured data describes the person and editing service without ratings", () => {
  const block = html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
  assert.ok(block, "JSON-LD block should exist");
  const data = JSON.parse(block[1]);
  assert.equal(data["@context"], "https://schema.org");
  assert.equal(data["@graph"][0]["@type"], "Person");
  assert.equal(data["@graph"][1]["@type"], "ProfessionalService");
  assert.equal(JSON.stringify(data).includes("aggregateRating"), false);
});

test("crawler files and the rendered social card target the public site", () => {
  const robots = readFileSync("robots.txt", "utf8");
  const sitemap = readFileSync("sitemap.xml", "utf8");
  assert.match(robots, /Sitemap: https:\/\/nhat-editor\.github\.io\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/nhat-editor\.github\.io\/<\/loc>/);
  const png = readFileSync("assets/social-preview.png");
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  assert.equal(`${width}x${height}`, "1200x630");
});

test("main index.html is Upwork-safe without direct off-platform contact details", () => {
  assert.doesNotMatch(html, /mailto:|zalo\.me|wa\.me|Nhatfreelancer\.dv@gmail\.com|contact\.html/i);
  assert.match(html, /upwork\.com\/freelancers\//);
});

test("contact.html provides external contact channels and is marked noindex", () => {
  assert.equal(existsSync("contact.html"), true, "contact.html should exist");
  const contactHtml = readFileSync("contact.html", "utf8");
  assert.match(contactHtml, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(contactHtml, /mailto:Nhatfreelancer\.dv@gmail\.com/);
  assert.match(contactHtml, /zalo\.me\//);
  assert.match(contactHtml, /wa\.me\//);
});
