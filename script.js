// 모바일 메뉴
const btn = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");

btn?.addEventListener("click", () => {
  const isOpen = !mobileMenu.hasAttribute("hidden");
  if (isOpen) {
    mobileMenu.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", "false");
  } else {
    mobileMenu.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
  }
});

mobileMenu?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileMenu.setAttribute("hidden", "");
    btn?.setAttribute("aria-expanded", "false");
  })
);

// 스크롤 리빌
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach((el) => io.observe(el));

// 히어로 텍스트 페이드/이동
const hero = document.querySelector(".hero-content");
window.addEventListener("scroll", () => {
  if (!hero) return;
  const y = window.scrollY;
  const fade = Math.max(0, 1 - y / 450);
  hero.style.opacity = String(fade);
  hero.style.transform = `translateY(${Math.min(24, y / 18)}px)`;
});

// Formspree 전송 (중복 리스너/중복 선언 없이 "1번만" 등록)
const form = document.getElementById("inquiryForm");
const statusEl = document.getElementById("formStatus");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl && (statusEl.textContent = "전송 중입니다...");

  try {
    const data = new FormData(form);

    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      alert("문의가 접수되었습니다. 빠르게 회신드리겠습니다!");
      form.reset();
      statusEl && (statusEl.textContent = "정상 접수되었습니다.");
    } else {
      const text = await res.text();
      console.error("Formspree error:", res.status, text);
      alert("전송에 실패했습니다. 입력값/설정 확인 후 다시 시도해주세요.");
      statusEl && (statusEl.textContent = "전송 실패 (콘솔 로그 확인)");
    }
  } catch (err) {
    console.error(err);
    alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    statusEl && (statusEl.textContent = "네트워크 오류");
  }
});
