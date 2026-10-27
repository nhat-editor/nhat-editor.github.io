/* Nguyen Quang Nhat — portfolio interactions */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");

/* Analytics stays inactive until a real provider ID is supplied. */
const ANALYTICS_MEASUREMENT_ID = "";
function trackEvent(name, parameters = {}) {
  if (!ANALYTICS_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}

/* ---------- Preloader ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const preloader = $(".preloader");
  const number = $(".preloader-num");
  const bar = $(".preloader-bar");
  if (!preloader) return;

  if (reducedMotion.matches) {
    if (number) number.textContent = "100";
    if (bar) bar.style.width = "100%";
    preloader.classList.add("done");
    return;
  }

  let progress = 0;
  const interval = window.setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 25 + 10);
    if (number) number.textContent = String(Math.floor(progress));
    if (bar) bar.style.width = `${progress}%`;
    if (progress === 100) {
      window.clearInterval(interval);
      window.setTimeout(() => preloader.classList.add("done"), 200);
    }
  }, 50);
});

/* ---------- Mobile navigation ---------- */
const navToggle = $(".nav-toggle");
const mobileMenu = $(".mobile-menu");

function setMenuOpen(open) {
  if (!navToggle || !mobileMenu) return;
  navToggle.classList.toggle("active", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.classList.toggle("active", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("no-scroll", open);
}

navToggle?.addEventListener("click", () => setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true"));
$$("a", mobileMenu || document.createElement("nav")).forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));

/* ---------- Cursor and magnetic controls ---------- */
const dot = $(".cursor-dot");
const ring = $(".cursor-ring");
if (dot && ring && hoverCapable.matches && !reducedMotion.matches) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    window.requestAnimationFrame(animateRing);
  })();

  $$("a, button, [data-cursor='hover']").forEach((element) => {
    element.addEventListener("mouseenter", () => ring.classList.add("hover"));
    element.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });

  $$(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const bounds = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * 0.3}px, ${(event.clientY - bounds.top - bounds.height / 2) * 0.4}px)`;
    });
    button.addEventListener("mouseleave", () => { button.style.transform = ""; });
  });
}

/* ---------- Smooth anchors ---------- */
let lenis = null;
if (!reducedMotion.matches && typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.2,
    easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
    smoothWheel: true,
  });
  (function raf(time) {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  })(performance.now());
}

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = $(id);
    if (!target) return;
    event.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -20 });
    else target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
    if (link.classList.contains("skip-link")) target.focus({ preventScroll: true });
  });
});

/* ---------- Lazy showreel ---------- */
function loadShowreel() {
  const container = $(".reel-video");
  const poster = $(".reel-poster");
  if (!container || container.querySelector("iframe")) return;

  const iframe = document.createElement("iframe");
  const source = container.dataset.showreelSrc;
  iframe.src = `${source}${source.includes("?") ? "&" : "?"}autoplay=1&rel=0`;
  iframe.title = "Nguyen Quang Nhat — video editing showreel";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  container.append(iframe);
  poster?.classList.add("hidden");
  trackEvent("play_showreel");
}

$(".reel-play")?.addEventListener("click", loadShowreel);

/* ---------- Capability-aware work previews ---------- */
function initPreviewCards() {
  $$(".work-card[data-preview]").forEach((card) => {
    const video = $(".work-preview", card);
    const source = $("source[data-src]", video);
    if (!video || !source) return;

    const loadPreview = () => {
      if (!source.src) {
        source.src = source.dataset.src;
        video.load();
      }
    };
    const playPreview = () => {
      if (reducedMotion.matches) return;
      loadPreview();
      const playback = video.play();
      if (playback) playback.then(() => card.classList.add("is-previewing")).catch(() => card.classList.remove("is-previewing"));
    };
    const stopPreview = () => {
      video.pause();
      video.currentTime = 0;
      card.classList.remove("is-previewing");
    };

    if (hoverCapable.matches) {
      card.addEventListener("mouseenter", playPreview);
      card.addEventListener("mouseleave", stopPreview);
    }
    card.addEventListener("focusin", playPreview);
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) stopPreview();
    });
    video.addEventListener("error", stopPreview);
  });
}
initPreviewCards();

/* ---------- Accessible project modal ---------- */
const modal = $("#modal");
const modalVideo = $("#modalVideo");
const modalIframe = $("#modalIframe");
const modalTitle = $("#modalTitle");
const modalClose = $(".modal-close", modal || document);
let modalTrigger = null;

function setPageInert(inert) {
  $$('body > :not(#modal):not(script)').forEach((element) => { element.inert = inert; });
}

function openModal(videoUrl, title, trigger) {
  if (!modal || !modalVideo || !modalIframe || !videoUrl) return;
  modalTrigger = trigger || document.activeElement;
  if (modalTitle) modalTitle.textContent = title || "Project preview";

  const isLocalVideo = /\.(webm|mp4)(?:$|\?)/i.test(videoUrl);
  if (isLocalVideo) {
    modalVideo.src = videoUrl;
    modalVideo.classList.add("active-media");
    modalIframe.classList.remove("active-media");
  } else {
    modalIframe.src = `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1&rel=0`;
    modalIframe.classList.add("active-media");
    modalVideo.classList.remove("active-media");
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  setPageInert(true);
  document.body.classList.add("no-scroll");
  const focusCloseButton = () => modalClose?.focus({ preventScroll: true });
  if (isLocalVideo) {
    const playback = modalVideo.play();
    if (playback) playback.then(focusCloseButton, focusCloseButton);
  } else {
    focusCloseButton();
  }
  window.setTimeout(focusCloseButton, 250);
  trackEvent("open_project", { project_title: title || "Project preview" });
}

function closeModal() {
  if (!modal || modal.getAttribute("aria-hidden") === "true") return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  setPageInert(false);
  document.body.classList.remove("no-scroll");

  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    modalVideo.classList.remove("active-media");
  }
  if (modalIframe) {
    modalIframe.removeAttribute("src");
    modalIframe.classList.remove("active-media");
  }
  modalTrigger?.focus();
  modalTrigger = null;
}

$$('.work-btn[data-video]').forEach((button) => button.addEventListener("click", () => openModal(button.dataset.video, button.dataset.title, button)));
modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });

document.addEventListener("keydown", (event) => {
  if (!modal || modal.getAttribute("aria-hidden") === "true") return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = $$("button, a[href], video[controls], iframe", modal).filter((element) => {
    const style = window.getComputedStyle(element);
    return !element.hidden && !element.disabled && style.display !== "none" && style.visibility !== "hidden";
  });
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* ---------- Progressive reveal ---------- */
if (!reducedMotion.matches && typeof gsap !== "undefined") {
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
  $$("[data-reveal]").forEach((element) => {
    gsap.from(element, {
      y: 40, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 90%", once: true },
    });
  });
}

$$('a[href^="mailto:"], .socials a[target="_blank"]').forEach((link) => {
  link.addEventListener("click", () => trackEvent("contact_click", { label: link.textContent.trim() }));
});
