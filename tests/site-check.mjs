import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const conceptSlugs = [
  "finance-explainer",
  "saas-launch",
  "property-story",
  "social-campaign",
];

const html = readFileSync("index.html", "utf8");
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

test("four honest concept projects use only local poster and preview media", () => {
  assert.equal((html.match(/Concept Project · Illustrative Content/g) ?? []).length, 4);
  assert.equal((html.match(/class="work-card"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /picsum\.photos|BigBuckBunny|aqz-KE-bpKQ/);
  for (const slug of conceptSlugs) {
    assert.match(html, new RegExp(`assets/concepts/${slug}\\.svg`));
    assert.match(html, new RegExp(`data-preview="assets/concepts/${slug}-preview\\.webm"`));
  }
});

test("concept copy avoids fabricated proof and sets an intended outcome", () => {
  assert.equal((html.match(/class="case-study"/g) ?? []).length, 4);
  assert.equal((html.match(/Intended outcome:/g) ?? []).length, 4);
  assert.doesNotMatch(html, /Happy Clients|Videos Delivered|150\+|40\+/);
});

test("social proof is framed as service expectations rather than testimonials", () => {
  assert.match(html, /id="expectations"/);
  assert.match(html, /What clients can expect/);
  assert.doesNotMatch(html, /testimonials-swiper|client-logo/);
});

test("heavy video media is deferred until visitor interaction", () => {
  assert.match(html, /data-showreel-src="https:\/\/www\.youtube\.com\/embed\/BeYzqS5ig2o"/);
  assert.doesNotMatch(html, /<iframe[^>]+src=/);
  assert.equal((html.match(/<video class="work-preview" muted loop playsinline preload="none"/g) ?? []).length, 4);
  assert.equal((html.match(/<source data-src="assets\/concepts\/.+-preview\.webm"/g) ?? []).length, 4);
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
  const dimensions = execFileSync("identify", ["-format", "%wx%h", "assets/social-preview.png"], { encoding: "utf8" });
  assert.equal(dimensions, "1200x630");
});
