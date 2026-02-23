// script-v2.js

// Mobile menu
(() => {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // 메뉴 클릭 시 닫기
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));

  // 바깥 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    close();
  });
})();

// Simple reveal (IntersectionObserver)
(() => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();
