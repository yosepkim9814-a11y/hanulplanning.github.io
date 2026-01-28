// =======================
// 1) 모바일 메뉴
// =======================
const btn = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (btn && mobileMenu) {
  btn.addEventListener("click", () => {
    mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
  });

  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.style.display = "none";
    });
  });
}

// =======================
// 2) 스크롤 리빌 (카드/이미지 쫘라락 등장)
// =======================
const reveals = document.querySelectorAll(".reveal");

if (reveals.length) {
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
}

// =======================
// 3) 히어로 글자 페이드/이동
// =======================
const hero = document.querySelector(".hero-content");
if (hero) {
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const fade = Math.max(0, 1 - y / 450);
    hero.style.opacity = String(fade);
    hero.style.transform = `translateY(${Math.min(24, y / 18)}px)`;
  });
}

// =======================
// 4) 문의 폼: Formspree로 실제 전송
//    (index.html form에 action/method 있어야 함)
// =======================
const inquiryForm = document.getElementById("inquiryForm");

if (inquiryForm) {
  inquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(inquiryForm);

      const res = await fetch(inquiryForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        alert("문의가 접수되었습니다. 빠르게 회신드리겠습니다!");
        inquiryForm.reset();
      } else {
        const text = await res.text();
        console.error("Formspree error:", res.status, text);
        alert("전송에 실패했습니다. Formspree 설정/인증을 확인해주세요.");
      }
    } catch (err) {
      console.error(err);
      alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  });
}
