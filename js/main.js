(() => {
  // Language toggle: Chinese is the markup default, data-en holds the English text.
  const btn = document.getElementById("langBtn");
  const els = [...document.querySelectorAll("[data-en]")];
  els.forEach((el) => (el.dataset.zh = el.textContent.trim()));

  function setLang(lang) {
    const en = lang === "en";
    els.forEach((el) => (el.textContent = en ? el.dataset.en : el.dataset.zh));
    document.documentElement.lang = en ? "en" : "zh-Hant";
    btn.textContent = en ? "中文" : "EN";
    btn.setAttribute("aria-label", en ? "切換為中文" : "Switch to English");
    try { localStorage.setItem("lang", lang); } catch {}
  }

  let lang = "zh";
  try { lang = localStorage.getItem("lang") || "zh"; } catch {}
  if (lang === "en") setLang("en");
  btn.addEventListener("click", () => setLang((lang = lang === "en" ? "zh" : "en")));

  document.getElementById("year").textContent = new Date().getFullYear();
})();
