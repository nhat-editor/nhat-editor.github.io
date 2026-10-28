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

/* ---------- Language ---------- */
const translations = {
  en: {

    "work.anim1.alt": "DaVinci Resolve Animations",
    "work.anim1.title": "DaVinci Resolve Animations",
    "work.anim1.brief": "Create dynamic animations using DaVinci Resolve.",
    "work.anim1.approach": "Fluid motion, clean typography, and precise keyframing.",
    "work.anim1.outcome": "Deliver a polished, high-energy visual experience.",
    "work.anim1.buttonTitle": "DaVinci Resolve Animations",
    "work.watchVideo": "Watch Video",

    "work.video6.alt": "Video Talking Head",
    "work.video6.category": "Talking Head · DaVinci Resolve",
    "work.video6.title": "Video Talking Head",
    "work.video6.brief": "Turn raw footage into a clean, engaging talking head video.",
    "work.video6.approach": "Tight pacing, dynamic captions, and smooth transitions.",
    "work.video6.outcome": "Keep the viewer engaged from start to finish.",
    "work.video6.buttonTitle": "Video Talking Head",
    "work.watchVideo": "Watch Video",

    "about.cta": "Let’s work together",
    "about.intro.prefix": "I’m",
    "about.intro.suffix": ", a video editor and motion designer focused on clean storytelling, intentional pacing, and motion that supports the message.",
    "about.kicker": "03 — About Me",
    "about.portraitAlt": "Portrait of Nguyen Quang Nhat",
    "about.principle.detail": "Detail-focused",
    "about.principle.remote": "Remote-ready",
    "about.principle.story": "Story-led",
    "about.remote": "I work remotely with international creators and teams, shaping raw footage into videos that feel clear, polished, and easy to keep watching.",
    "about.skill.motion3d": "3D Motion Graphics",
    "about.skill.subtitles": "Dynamic Subtitles",
    "about.skill.talkingHead": "Talking Head Videos",
    "about.software": "Core Software",
    "about.specialties": "Key Specialties",
    "about.title.first": "Story first,",
    "about.title.second": "frames second.",
    "case.approach": "Approach:",
    "case.brief": "Brief:",
    "case.outcome": "Intended outcome:",
    "contact.email": "Email ↗",
    "contact.kicker": "06 — Contact",
    "contact.title.first": "Let’s bring your",
    "contact.title.second": "video ideas to life",
    "expectations.communication.body": "Practical updates, direct questions, and no mystery around the next step.",
    "expectations.communication.title": "Clear communication",
    "expectations.delivery.body": "Predictable versions, tidy exports, and files prepared for the platforms that matter.",
    "expectations.delivery.title": "Organized delivery",
    "expectations.intro": "Not borrowed testimonials—just the standards I bring to every collaboration.",
    "expectations.kicker": "05 — Working Together",
    "expectations.story.body": "Effects serve the message. Rhythm, clarity, and audience attention come first.",
    "expectations.story.title": "Story-first decisions",
    "expectations.title": "What clients can expect",
    "footer.copyright": "© 2026 Nguyen Quang Nhat. All rights reserved.",
    "footer.top": "Back to top ↑",
    "hero.kicker": "Portfolio · Available worldwide",
    "hero.specialtiesLabel": "Editing specialties",
    "hero.start": "Start a Project",
    "hero.subtitle": "Video Editor & Motion Designer crafting clean, fast-paced edits and visual stories that make every second earn attention.",
    "hero.watch": "Watch Showreel",
    "language.label": "Language",
    "meta.description": "Video editor and motion designer creating story-first talking head videos, product films, social campaigns, and clean motion graphics for international clients.",
    "meta.title": "Nguyen Quang Nhat — Video Editor & Motion Designer",
    "modal.close": "Close preview",
    "modal.defaultTitle": "Project preview",
    "modal.iframeTitle": "Project video",
    "nav.about": "About",
    "nav.closeMenu": "Close menu",
    "nav.contact": "Contact",
    "nav.homeLabel": "Nguyen Quang Nhat — home",
    "nav.mobileLabel": "Mobile navigation",
    "nav.openMenu": "Open menu",
    "nav.primaryLabel": "Primary navigation",
    "nav.process": "Process",
    "nav.showreel": "Showreel",
    "nav.why": "Why Me",
    "nav.work": "Work",
    "preloader.label": "Loading cinematic experience",
    "process.brief.body": "We align on the audience, purpose, references, deliverables, and what success should feel like.",
    "process.brief.title": "Brief & Direction",
    "process.delivery.body": "Feedback stays organized, revisions stay focused, and final files arrive in the formats you need.",
    "process.delivery.title": "Review & Delivery",
    "process.finish.body": "Captions, graphics, sound design, and grading add clarity and a cohesive finish.",
    "process.finish.title": "Motion, Sound & Color",
    "process.kicker": "04 — Process",
    "process.structure.body": "I shape the narrative and pacing first, so every visual decision supports a strong foundation.",
    "process.structure.title": "Structure & Rough Cut",
    "process.title": "A clear path from brief to delivery",
    "showreel.iframeTitle": "Nguyen Quang Nhat — video editing showreel",
    "showreel.intro": "A focused selection of editing, pacing, motion, and visual storytelling work.",
    "showreel.kicker": "01 — Real Work",
    "showreel.playLabel": "Play Nguyen Quang Nhat’s showreel",
    "showreel.posterAlt": "Nguyen Quang Nhat video editing showreel",
    "showreel.title": "Featured Showreel",
    "skip.content": "Skip to content",
    "specialty.cleanEdits": "Clean Edits",
    "specialty.colorGrading": "Color Grading",
    "specialty.dynamicCaptions": "Dynamic Captions",
    "specialty.motionGraphics": "Motion Graphics",
    "specialty.soundDesign": "Sound Design",
    "specialty.talkingHead": "Talking Head",
    "work.disclosure": "Concept Project · Illustrative Content",
    "work.finance.alt": "Finance explainer concept with animated data graphics",
    "work.finance.approach": "Tight pacing, kinetic captions, restrained data motion, and purposeful b-roll cues.",
    "work.finance.brief": "Turn a dense finance topic into an approachable, high-retention explainer.",
    "work.finance.buttonTitle": "Clarity in Every Cut — Concept Preview",
    "work.finance.category": "Talking Head · Finance & Tech",
    "work.finance.outcome": "Help viewers understand the core idea without losing momentum.",
    "work.finance.title": "Clarity in Every Cut",
    "work.intro": "Temporary concept studies showing how I think about structure, rhythm, and visual communication. These are illustrative, not client commissions.",
    "work.kicker": "02 — Selected Works",
    "work.previewAction": "View Motion Preview",
    "work.previewHint": "Hover to preview",
    "work.property.alt": "Cinematic property-film concept in dark architectural tones",
    "work.property.approach": "Patient reveals, motivated speed ramps, warm sound texture, and cohesive color.",
    "work.property.brief": "Present a property through atmosphere rather than a conventional room-by-room tour.",
    "work.property.buttonTitle": "Space Becomes a Feeling — Concept Preview",
    "work.property.category": "Property · Cinematic Story",
    "work.property.outcome": "Let prospective viewers imagine the experience of being there.",
    "work.property.title": "Space Becomes a Feeling",
    "work.social.alt": "Fast-paced vertical social campaign concept",
    "work.social.approach": "Hook-first structure, rhythmic punch-ins, readable captions, and modular graphic beats.",
    "work.social.brief": "Build a repeatable short-form system with a strong opening and recognizable visual language.",
    "work.social.buttonTitle": "Stop the Scroll — Concept Preview",
    "work.social.category": "Short Form · Social Campaign",
    "work.social.outcome": "Create consistent episodes that remain clear even when watched without sound.",
    "work.social.title": "Stop the Scroll, Keep the Story",
    "work.tag.contentSystem": "Content System",
    "work.tag.dataMotion": "Data Motion",
    "work.tag.kineticType": "Kinetic Type",
    "work.tag.uiMotion": "UI Motion",
    "work.tag.verticalEditing": "Vertical Editing",
    "work.tag.visualRhythm": "Visual Rhythm",
    "work.title": "Editing Scenarios",
  },
  vi: {

    "work.anim1.alt": "Đồ họa chuyển động DaVinci Resolve",
    "work.anim1.title": "Đồ họa chuyển động DaVinci Resolve",
    "work.anim1.brief": "Tạo các chuyển động linh hoạt bằng DaVinci Resolve.",
    "work.anim1.approach": "Chuyển động mượt mà, typography gọn gàng và keyframe chính xác.",
    "work.anim1.outcome": "Mang lại trải nghiệm hình ảnh chỉn chu và đầy năng lượng.",
    "work.anim1.buttonTitle": "Đồ họa chuyển động DaVinci Resolve",
    "work.watchVideo": "Xem Video",

    "work.video6.alt": "Video Talking Head",
    "work.video6.category": "Talking Head · DaVinci Resolve",
    "work.video6.title": "Video Talking Head",
    "work.video6.brief": "Biến cảnh quay thô thành video talking head rõ ràng, cuốn hút.",
    "work.video6.approach": "Nhịp dựng chặt chẽ, phụ đề động và chuyển cảnh mượt mà.",
    "work.video6.outcome": "Giữ chân người xem từ đầu đến cuối video.",
    "work.video6.buttonTitle": "Video Talking Head",
    "work.watchVideo": "Xem Video",

    "about.cta": "Cùng hợp tác nhé",
    "about.intro.prefix": "Tôi là",
    "about.intro.suffix": ", một video editor và motion designer tập trung vào kể chuyện mạch lạc, nhịp dựng có chủ đích và các chuyển động tôn lên thông điệp.",
    "about.kicker": "03 — Giới thiệu",
    "about.portraitAlt": "Chân dung Nguyen Quang Nhat",
    "about.principle.detail": "Chú trọng chi tiết",
    "about.principle.remote": "Sẵn sàng làm việc từ xa",
    "about.principle.story": "Ưu tiên câu chuyện",
    "about.remote": "Tôi làm việc từ xa cùng các nhà sáng tạo và đội ngũ quốc tế, biến những thước phim thô thành sản phẩm rõ ràng, chỉn chu và cuốn hút.",
    "about.skill.motion3d": "Đồ họa chuyển động 3D",
    "about.skill.subtitles": "Phụ đề động",
    "about.skill.talkingHead": "Video talking head",
    "about.software": "Phần mềm chính",
    "about.specialties": "Chuyên môn nổi bật",
    "about.title.first": "Câu chuyện trước,",
    "about.title.second": "khung hình sau.",
    "case.approach": "Cách thực hiện:",
    "case.brief": "Đề bài:",
    "case.outcome": "Mục tiêu:",
    "contact.email": "Email ↗",
    "contact.kicker": "06 — Liên hệ",
    "contact.title.first": "Cùng biến ý tưởng",
    "contact.title.second": "thành thước phim",
    "expectations.communication.body": "Cập nhật tiến độ thực tế, trao đổi thẳng thắn và luôn minh bạch về các bước tiếp theo.",
    "expectations.communication.title": "Trao đổi rõ ràng",
    "expectations.delivery.body": "Các phiên bản nhất quán, file xuất gọn gàng và đúng chuẩn cho từng nền tảng.",
    "expectations.delivery.title": "Bàn giao có tổ chức",
    "expectations.intro": "Không cần những lời khen có cánh — đây là tiêu chuẩn tôi mang đến trong mỗi lần hợp tác.",
    "expectations.kicker": "05 — Đồng hành cùng nhau",
    "expectations.story.body": "Hiệu ứng phải tôn lên thông điệp. Nhịp điệu, sự rõ ràng và sự chú ý của người xem luôn được đặt lên hàng đầu.",
    "expectations.story.title": "Quyết định dựa trên câu chuyện",
    "expectations.title": "Điều khách hàng có thể mong đợi",
    "footer.copyright": "© 2026 Nguyen Quang Nhat. Bảo lưu mọi quyền.",
    "footer.top": "Về đầu trang ↑",
    "hero.kicker": "Portfolio · Sẵn sàng hợp tác toàn cầu",
    "hero.specialtiesLabel": "Chuyên môn dựng phim",
    "hero.start": "Bắt đầu dự án",
    "hero.subtitle": "Video Editor & Motion Designer tạo nên những bản dựng gọn gàng, nhịp điệu cuốn hút và câu chuyện hình ảnh khiến mọi khung hình đều đáng giá.",
    "hero.watch": "Xem showreel",
    "language.label": "Ngôn ngữ",
    "meta.description": "Video editor và motion designer chuyên video talking head, phim sản phẩm, chiến dịch mạng xã hội và motion graphics cho khách hàng quốc tế.",
    "meta.title": "Nguyen Quang Nhat — Video Editor & Motion Designer",
    "modal.close": "Đóng bản xem trước",
    "modal.defaultTitle": "Xem trước dự án",
    "modal.iframeTitle": "Video dự án",
    "nav.about": "Giới thiệu",
    "nav.closeMenu": "Đóng menu",
    "nav.contact": "Liên hệ",
    "nav.homeLabel": "Nguyen Quang Nhat — trang chủ",
    "nav.mobileLabel": "Điều hướng di động",
    "nav.openMenu": "Mở menu",
    "nav.primaryLabel": "Điều hướng chính",
    "nav.process": "Quy trình",
    "nav.showreel": "Showreel",
    "nav.why": "Vì sao chọn tôi",
    "nav.work": "Dự án",
    "preloader.label": "Đang khởi tạo không gian",
    "process.brief.body": "Cùng thống nhất về đối tượng khán giả, mục tiêu, tài liệu tham khảo, sản phẩm bàn giao và tiêu chí thành công.",
    "process.brief.title": "Đề bài & Định hướng",
    "process.delivery.body": "Phản hồi được sắp xếp rõ ràng, chỉnh sửa đúng trọng tâm và bàn giao đúng định dạng bạn cần.",
    "process.delivery.title": "Duyệt & Bàn giao",
    "process.finish.body": "Phụ đề, đồ họa, thiết kế âm thanh và chỉnh màu giúp tăng tính rõ ràng và tạo sự nhất quán cho toàn bộ video.",
    "process.finish.title": "Chuyển động, Âm thanh & Màu sắc",
    "process.kicker": "04 — Quy trình",
    "process.structure.body": "Tôi định hình câu chuyện và nhịp dựng trước để mọi quyết định hình ảnh đều có nền tảng vững chắc.",
    "process.structure.title": "Cấu trúc & Bản dựng thô",
    "process.title": "Lộ trình rõ ràng từ đề bài đến bàn giao",
    "showreel.iframeTitle": "Showreel dựng phim của Nguyen Quang Nhat",
    "showreel.intro": "Tuyển chọn tập trung vào kỹ thuật dựng, nhịp điệu, chuyển động và kể chuyện bằng hình ảnh.",
    "showreel.kicker": "01 — Dự án thực tế",
    "showreel.playLabel": "Phát showreel của Nguyen Quang Nhat",
    "showreel.posterAlt": "Showreel dựng phim của Nguyen Quang Nhat",
    "showreel.title": "Showreel nổi bật",
    "skip.content": "Bỏ qua đến nội dung chính",
    "specialty.cleanEdits": "Dựng phim gọn gàng",
    "specialty.colorGrading": "Chỉnh màu",
    "specialty.dynamicCaptions": "Phụ đề động",
    "specialty.motionGraphics": "Đồ họa chuyển động",
    "specialty.soundDesign": "Thiết kế âm thanh",
    "specialty.talkingHead": "Video talking head",
    "work.disclosure": "Dự án ý tưởng · Nội dung minh họa",
    "work.finance.alt": "Ý tưởng video giải thích tài chính với đồ họa dữ liệu chuyển động",
    "work.finance.approach": "Nhịp dựng chặt chẽ, phụ đề động, chuyển động dữ liệu tiết chế và các điểm chèn b-roll có chủ đích.",
    "work.finance.brief": "Đơn giản hóa chủ đề tài chính phức tạp thành video giải thích dễ hiểu và giữ chân người xem.",
    "work.finance.buttonTitle": "Rõ ràng trong từng nhát cắt — Bản xem trước ý tưởng",
    "work.finance.category": "Talking Head · Tài chính & Công nghệ",
    "work.finance.outcome": "Giúp người xem hiểu ý chính mà không làm mất nhịp theo dõi.",
    "work.finance.title": "Rõ ràng trong từng nhát cắt",
    "work.intro": "Những bản nghiên cứu ý tưởng thể hiện cách tôi tư duy về cấu trúc, nhịp điệu và truyền đạt hình ảnh. Đây là nội dung minh họa, không phải dự án thực tế từ khách hàng.",
    "work.kicker": "02 — Dự án chọn lọc",
    "work.previewAction": "Xem bản xem trước",
    "work.previewHint": "Rê chuột để xem trước",
    "work.property.alt": "Ý tưởng phim bất động sản điện ảnh với tông kiến trúc tối",
    "work.property.approach": "Nhịp hé lộ chậm rãi, speed ramp có chủ đích, âm thanh ấm áp và màu sắc nhất quán.",
    "work.property.brief": "Giới thiệu bất động sản bằng bầu không khí thay vì chuyến tham quan từng phòng thông thường.",
    "work.property.buttonTitle": "Không gian trở thành cảm xúc — Bản xem trước ý tưởng",
    "work.property.category": "Bất động sản · Câu chuyện điện ảnh",
    "work.property.outcome": "Giúp khách hàng tiềm năng hình dung trọn vẹn trải nghiệm khi sống trong không gian đó.",
    "work.property.title": "Không gian trở thành cảm xúc",
    "work.social.alt": "Ý tưởng chiến dịch mạng xã hội dọc với tiết tấu nhanh",
    "work.social.approach": "Cấu trúc tập trung vào hook, cắt cảnh punch-in theo nhịp, phụ đề dễ đọc và các nhịp đồ họa dạng mô-đun.",
    "work.social.brief": "Xây dựng hệ thống video ngắn có thể lặp lại với phần mở đầu mạnh và ngôn ngữ hình ảnh dễ nhận diện.",
    "work.social.buttonTitle": "Dừng cú lướt, giữ câu chuyện — Bản xem trước ý tưởng",
    "work.social.category": "Video ngắn · Chiến dịch mạng xã hội",
    "work.social.outcome": "Tạo chuỗi video nhất quán, vẫn truyền tải rõ ràng ngay cả khi người xem tắt âm thanh.",
    "work.social.title": "Dừng cú lướt, giữ câu chuyện",
    "work.tag.contentSystem": "Hệ thống nội dung",
    "work.tag.dataMotion": "Chuyển động dữ liệu",
    "work.tag.kineticType": "Chữ chuyển động",
    "work.tag.uiMotion": "Chuyển động UI",
    "work.tag.verticalEditing": "Dựng video dọc",
    "work.tag.visualRhythm": "Nhịp điệu hình ảnh",
    "work.title": "Kịch bản dựng phim",
  },
};

const SUPPORTED_LANGUAGES = new Set(["en", "vi"]);
const LANGUAGE_STORAGE_KEY = "portfolio-language";
let currentLanguage = "en";

function translate(key, language = currentLanguage) {
  const selectedLanguage = SUPPORTED_LANGUAGES.has(language) ? language : "en";
  return translations[selectedLanguage][key] ?? translations.en[key] ?? key;
}

function getSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.has(savedLanguage) ? savedLanguage : "en";
  } catch {
    return "en";
  }
}

function applyLanguage(language, { persist = true } = {}) {
  currentLanguage = SUPPORTED_LANGUAGES.has(language) ? language : "en";
  document.documentElement.lang = currentLanguage;

  $$('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  $$('[data-i18n-attr]').forEach((element) => {
    element.dataset.i18nAttr.split(";").forEach((mapping) => {
      const separator = mapping.indexOf(":");
      if (separator < 1) return;
      const attribute = mapping.slice(0, separator);
      const key = mapping.slice(separator + 1);
      element.setAttribute(attribute, translate(key));
    });
  });
  $$('[data-language]').forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
  });

  const menuToggle = $(".nav-toggle");
  if (menuToggle?.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-label", translate("nav.closeMenu"));
  }

  if (persist) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    } catch { }
  }
}

applyLanguage(getSavedLanguage(), { persist: false });
$$('[data-language]').forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

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
  navToggle.setAttribute("aria-label", translate(open ? "nav.closeMenu" : "nav.openMenu"));
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
  iframe.title = translate("showreel.iframeTitle");
  iframe.dataset.i18nAttr = "title:showreel.iframeTitle";
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
let modalFocusTimer = null;

function setPageInert(inert) {
  $$('body > :not(#modal):not(script)').forEach((element) => { element.inert = inert; });
}

function openModal(videoUrl, title, trigger) {
  if (!modal || !modalVideo || !modalIframe || !videoUrl) return;
  modalTrigger = trigger || document.activeElement;
  if (modalTitle) modalTitle.textContent = title || translate("modal.defaultTitle");

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
  const focusCloseButton = () => {
    if (modal.getAttribute("aria-hidden") === "false") modalClose?.focus({ preventScroll: true });
  };
  if (isLocalVideo) {
    const playback = modalVideo.play();
    if (playback) playback.then(focusCloseButton, focusCloseButton);
  } else {
    focusCloseButton();
  }
  if (modalFocusTimer !== null) window.clearTimeout(modalFocusTimer);
  modalFocusTimer = window.setTimeout(() => {
    modalFocusTimer = null;
    focusCloseButton();
  }, 250);
  trackEvent("open_project", { project_title: title || translate("modal.defaultTitle") });
}

function closeModal() {
  if (!modal || modal.getAttribute("aria-hidden") === "true") return;
  if (modalFocusTimer !== null) {
    window.clearTimeout(modalFocusTimer);
    modalFocusTimer = null;
  }
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
