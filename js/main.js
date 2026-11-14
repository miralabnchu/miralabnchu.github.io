(() => {
  const root = document.documentElement;

  // Language toggle: Chinese is the markup default, data-en holds the English text.
  const btn = document.getElementById("langBtn");
  const els = [...document.querySelectorAll("[data-en]")];
  els.forEach((el) => (el.dataset.zh = el.textContent.trim()));

  function setLang(lang) {
    const en = lang === "en";
    els.forEach((el) => (el.textContent = en ? el.dataset.en : el.dataset.zh));
    root.lang = en ? "en" : "zh-Hant";
    btn.textContent = en ? "中文" : "EN";
    btn.setAttribute("aria-label", en ? "切換為中文" : "Switch to English");
    try { localStorage.setItem("lang", lang); } catch {}
  }

  let lang = "zh";
  try { lang = localStorage.getItem("lang") || "zh"; } catch {}
  if (lang === "en") setLang("en");
  btn.addEventListener("click", () => setLang((lang = lang === "en" ? "zh" : "en")));

  document.getElementById("year").textContent = new Date().getFullYear();

  // Mark the nav link of the section currently being read.
  const links = [...document.querySelectorAll(".top-nav a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  function updateCurrent() {
    const line = innerHeight * 0.35;
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    let current = -1;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) current = i; });
    if (atBottom) current = sections.length - 1;
    links.forEach((a, i) => {
      if (i === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  addEventListener("scroll", updateCurrent, { passive: true });
  addEventListener("resize", updateCurrent);
  updateCurrent();

  if (!("IntersectionObserver" in window)) return;

  // Content fades up once as it enters the viewport.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.classList.add("js");
  const items = document.querySelectorAll(".area, .flow, .rows > div, .index, .map-cols");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
})();
