// 모바일 메뉴
const btn = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMobileMenu(force) {
  if (!mobileMenu || !btn) return;
  const isOpen = force ?? (mobileMenu.style.display !== "block");
  mobileMenu.style.display = isOpen ? "block" : "none";
  btn.setAttribute("aria-expanded", String(isOpen));
}

btn?.addEventListener("click", () => toggleMobileMenu());
mobileMenu?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => toggleMobileMenu(false));
});

// 스크롤 리빌
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

// 히어로 글자 페이드/이동
const hero = document.querySelector(".hero-content");
window.addEventListener("scroll", () => {
  if (!hero) return;
  const y = window.scrollY;
  const fade = Math.max(0, 1 - y / 450);
  hero.style.opacity = String(fade);
  hero.style.transform = `translateY(${Math.min(26, y / 18)}px)`;
});

// Formspree AJAX 전송 (한 번만!)
const form = document.getElementById("inquiryForm");
const msg = document.getElementById("formMsg");

function setMsg(text, type) {
  if (!msg) return;
  msg.textContent = text;
  msg.classList.remove("ok", "bad");
  if (type) msg.classList.add(type);
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.action) {
    setMsg("폼 action(전송 주소)이 비어있습니다. Formspree URL을 확인해주세요.", "bad");
    return;
  }

  setMsg("전송 중입니다…", null);

  try {
    const data = new FormData(form);

    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (res.ok) {
      setMsg("문의가 접수되었습니다. 빠르게 회신드리겠습니다!", "ok");
      form.reset();
      return;
    }

    // 실패 시 원인 로그
    const text = await res.text();
    console.error("Formspree error:", res.status, text);
    setMsg("전송에 실패했습니다. 입력값/설정 확인 후 다시 시도해주세요.", "bad");
  } catch (err) {
    console.error(err);
    setMsg("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", "bad");
  }
});
