(() => {
  const root = document.documentElement;

  // Language toggle: Chinese is the markup default, data-en holds the English text.
  const btn = document.getElementById("langBtn");
  const els = [...document.querySelectorAll("[data-en]")];
  els.forEach((el) => (el.dataset.zh = el.textContent.trim()));
  // Images keep their English alt text in data-en-alt.
  const alts = [...document.querySelectorAll("img[data-en-alt]")];
  alts.forEach((img) => (img.dataset.zhAlt = img.alt));
  // Icon buttons keep their English name in data-en-label.
  const labels = [...document.querySelectorAll("[data-en-label]")];
  labels.forEach((el) => (el.dataset.zhLabel = el.getAttribute("aria-label")));

  function setLang(lang) {
    const en = lang === "en";
    els.forEach((el) => (el.textContent = en ? el.dataset.en : el.dataset.zh));
    alts.forEach((img) => (img.alt = en ? img.dataset.enAlt : img.dataset.zhAlt));
    labels.forEach((el) => el.setAttribute("aria-label", en ? el.dataset.enLabel : el.dataset.zhLabel));
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

  // The nav link of the current page is marked in each page's own markup (aria-current="page").

  // Slideshows (.slides[data-slides]): photos cross-fade one at a time, slowly.
  // They play by themselves from the moment the page opens and loop forever; the timer rests only
  // while the tab is in the background. With "reduce motion" on the photos still change, but they
  // switch at once instead of fading (the stylesheet turns the transition off).
  document.querySelectorAll("[data-slides]").forEach((box) => {
    const imgs = [...box.querySelectorAll(".slides-frame img")];
    if (imgs.length < 2) return;
    const every = Number(box.dataset.interval) || 6000;
    let at = Math.max(0, imgs.findIndex((img) => img.classList.contains("is-on")));
    let timer = 0;

    function show(i) {
      at = (i + imgs.length) % imgs.length;
      imgs.forEach((img, n) => {
        img.classList.toggle("is-on", n === at);
        img.setAttribute("aria-hidden", n === at ? "false" : "true");
      });
    }
    // Decode every photo ahead of time, so the frame does not flash empty the first time one is shown.
    imgs.forEach((img) => { if (img.decode) img.decode().catch(() => {}); });
    function schedule() {
      clearInterval(timer);
      if (!document.hidden) timer = setInterval(() => show(at + 1), every);
    }
    // The arrows on the photo step by hand; the timer then starts over, so the new photo gets its full time.
    box.querySelector("[data-slides-prev]")?.addEventListener("click", () => { show(at - 1); schedule(); });
    box.querySelector("[data-slides-next]")?.addEventListener("click", () => { show(at + 1); schedule(); });
    document.addEventListener("visibilitychange", schedule);

    show(at);
    schedule();
  });

  if (!("IntersectionObserver" in window)) return;

  // Portrait clips: loop silently while on screen, pause when scrolled away.
  // With "reduce motion" on they stay still and only play on hover or keyboard focus.
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clips = [...document.querySelectorAll(".portrait video")];
  clips.forEach((v) => { v.muted = true; v.loop = true; v.playsInline = true; });
  const play = (v) => { const p = v.play(); if (p) p.catch(() => {}); };
  if (still) {
    clips.forEach((v) => {
      const tile = v.closest(".person, .pi");
      tile.tabIndex = 0;
      ["pointerenter", "focus"].forEach((e) => tile.addEventListener(e, () => play(v)));
      ["pointerleave", "blur"].forEach((e) => tile.addEventListener(e, () => v.pause()));
    });
  } else if (clips.length) {
    const watch = new IntersectionObserver(
      (entries) => entries.forEach((en) => (en.isIntersecting ? play(en.target) : en.target.pause())),
      { threshold: 0.25 }
    );
    clips.forEach((v) => watch.observe(v));
  }
})();
