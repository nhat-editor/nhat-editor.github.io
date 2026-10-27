import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import test, { after, before } from "node:test";

const webPort = 8123;
const debugPort = 9223;
const tempRoot = `/tmp/nhat-editor-browser-${process.pid}`;
let server;
let browser;
let socket;
let nextId = 1;
const pending = new Map();

const waitFor = async (check, timeoutMs = 10_000) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const value = await check();
      if (value) return value;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for browser readiness");
};

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  const timer = setTimeout(() => {
    pending.delete(id);
    reject(new Error(`CDP command timed out: ${method}`));
  }, 5_000);
  pending.set(id, (message) => {
    clearTimeout(timer);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
};

before(async () => {
  mkdirSync(`${tempRoot}/config`, { recursive: true });
  mkdirSync(`${tempRoot}/cache`, { recursive: true });
  mkdirSync(`${tempRoot}/profile`, { recursive: true });

  server = spawn("python3", ["-m", "http.server", String(webPort), "--bind", "127.0.0.1"], {
    cwd: process.cwd(), stdio: "ignore",
  });
  await waitFor(async () => (await fetch(`http://127.0.0.1:${webPort}/`)).ok);

  browser = spawn("chromium", [
    "--headless", "--no-sandbox", "--disable-gpu", "--disable-background-networking",
    "--disable-breakpad", "--disable-crash-reporter", "--disable-dev-shm-usage",
    `--user-data-dir=${tempRoot}/profile`,
    "--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1",
    `--remote-debugging-port=${debugPort}`, "about:blank",
  ], {
    env: { ...process.env, XDG_CONFIG_HOME: `${tempRoot}/config`, XDG_CACHE_HOME: `${tempRoot}/cache` },
    stdio: "ignore",
  });

  await waitFor(async () => (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).ok);
  const target = await fetch(`http://127.0.0.1:${debugPort}/json/new?http%3A%2F%2F127.0.0.1%3A${webPort}%2F`, { method: "PUT" }).then((response) => response.json());
  socket = new WebSocket(target.webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Runtime.enable");
  await send("Page.enable");
  await waitFor(() => evaluate("document.readyState === 'complete'"));
});

after(() => {
  socket?.close();
  browser?.kill("SIGTERM");
  server?.kill("SIGTERM");
});

test("skip link moves keyboard focus to the main landmark", async () => {
  await evaluate("document.querySelector('.skip-link').focus(); document.querySelector('.skip-link').click(); true");
  await waitFor(() => evaluate("document.activeElement.id === 'main-content'"));
  assert.equal(await evaluate("document.activeElement.id"), "main-content");
});

test("showreel iframe is created only after activation", async () => {
  assert.equal(await evaluate("Boolean(document.querySelector('.reel-video iframe'))"), false);
  await evaluate("document.querySelector('.reel-play').click(); true");
  await waitFor(() => evaluate("Boolean(document.querySelector('.reel-video iframe'))"));
  assert.match(await evaluate("document.querySelector('.reel-video iframe').src"), /BeYzqS5ig2o/);
});

test("a concept preview loads on focus without replacing its poster fallback", async () => {
  assert.equal(await evaluate("document.querySelector('.work-preview source').src"), "");
  await evaluate("document.querySelector('.work-btn').focus(); true");
  await waitFor(() => evaluate("Boolean(document.querySelector('.work-preview source').src)"));
  assert.equal(await evaluate("Boolean(document.querySelector('.work-thumb img'))"), true);
});

test("project modal opens local video and restores trigger focus on close", async () => {
  await evaluate("document.querySelector('.work-btn').click(); true");
  assert.equal(await evaluate("document.querySelector('#modal').getAttribute('aria-hidden')"), "false");
  await waitFor(() => evaluate("document.activeElement.classList.contains('modal-close')"));
  const activeElement = await evaluate("document.activeElement.outerHTML");
  assert.equal(await evaluate("document.activeElement.classList.contains('modal-close')"), true, activeElement);
  assert.equal(await evaluate("document.querySelector('main').inert && document.querySelector('header').inert"), true);
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", modifiers: 8 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", modifiers: 8 });
  assert.equal(await evaluate("document.querySelector('#modal').contains(document.activeElement)"), true);
  assert.match(await evaluate("document.querySelector('#modalVideo').src"), /finance-explainer-preview\.webm/);
  await evaluate("document.querySelector('.modal-close').click(); true");
  assert.equal(await evaluate("document.querySelector('#modal').getAttribute('aria-hidden')"), "true");
  assert.equal(await evaluate("document.querySelector('main').inert || document.querySelector('header').inert"), false);
  assert.equal(await evaluate("document.activeElement.classList.contains('work-btn')"), true);
});

test("a failed preview keeps the poster and project action usable", async () => {
  await evaluate(`(() => {
    const card = document.querySelectorAll('.work-card')[1];
    const source = card.querySelector('source');
    source.removeAttribute('src');
    source.dataset.src = 'assets/concepts/missing-preview.webm';
    card.querySelector('.work-btn').focus();
  })()`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  assert.equal(await evaluate("document.querySelectorAll('.work-card')[1].classList.contains('is-previewing')"), false);
  assert.equal(await evaluate("Boolean(document.querySelectorAll('.work-card')[1].querySelector('img'))"), true);
});

test("reduced-motion visitors receive static media and no delayed preloader", async () => {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await send("Page.reload", { ignoreCache: true });
  await new Promise((resolve) => setTimeout(resolve, 300));
  await waitFor(() => evaluate("document.readyState === 'complete' && document.querySelector('.preloader').classList.contains('done')"));
  await evaluate("document.querySelector('.work-btn').focus(); true");
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.equal(await evaluate("document.querySelector('.work-preview source').src"), "");
  assert.equal(await evaluate("document.querySelector('.work-card').classList.contains('is-previewing')"), false);
});

test("390px mobile layout has no horizontal overflow and exposes the menu control", async () => {
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
  });
  await send("Page.reload", { ignoreCache: true });
  await new Promise((resolve) => setTimeout(resolve, 300));
  await waitFor(() => evaluate("document.readyState === 'complete'"));
  const layout = JSON.parse(await evaluate(`JSON.stringify({
    viewport: window.innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    toggleDisplay: getComputedStyle(document.querySelector('.nav-toggle')).display,
    workColumns: getComputedStyle(document.querySelector('.work-grid')).gridTemplateColumns
  })`));
  assert.equal(layout.viewport, 390);
  assert.ok(layout.pageWidth <= layout.viewport, `page width ${layout.pageWidth} exceeded ${layout.viewport}`);
  assert.notEqual(layout.toggleDisplay, "none");
  assert.equal(layout.workColumns.split(" ").length, 1);
});
