// 모바일 메뉴
const btn = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");

btn?.addEventListener("click", () => {
  if (!mobileMenu) return;
  mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
});

mobileMenu?.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    mobileMenu.style.display = "none";
  })
);

// 스크롤 리빌
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => io.observe(el));

// 히어로 텍스트 페이드/이동
const hero = document.querySelector(".hero-content");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (!hero) return;
  const fade = Math.max(0, 1 - y / 450);
  hero.style.opacity = String(fade);
  hero.style.transform = `translateY(${Math.min(24, y / 18)}px)`;
});

// Formspree AJAX 전송 + 알림
const form = document.getElementById("inquiryForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const data = new FormData(form);

    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (res.ok) {
      alert("문의가 접수되었습니다. 빠르게 회신드리겠습니다!");
      form.reset();
    } else {
      const text = await res.text();
      console.error("Formspree error:", res.status, text);
      alert("전송에 실패했습니다. 입력값/설정 확인 후 다시 시도해주세요.");
    }
  } catch (err) {
    console.error(err);
    alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});
