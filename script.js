// 모바일 메뉴
const btn = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");
btn?.addEventListener("click", () => {
  mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
});
mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.style.display = "none";
}));

// 스크롤 리빌 (카드/이미지 "쫘라락" 등장)
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
},{threshold:0.12});
reveals.forEach(el=>io.observe(el));

// 히어로 글자 '위로 사라지는' 느낌(스크롤하면 살짝 이동/페이드)
const hero = document.querySelector(".hero-content");
window.addEventListener("scroll", ()=>{
  const y = window.scrollY;
  if(!hero) return;
  const fade = Math.max(0, 1 - y/450);
  hero.style.opacity = String(fade);
  hero.style.transform = `translateY(${Math.min(24, y/18)}px)`;
});

// 문의 폼: 일단은 메일 전송 방식(가장 쉬움)
// 나중에 "폼스프리/구글폼/폼스파이" 같은 서비스로 바꿀 수 있음.
const form = document.getElementById("inquiryForm");
form?.addEventListener("submit", (e)=>{
  e.preventDefault();

  const data = new FormData(form);
  const subject = encodeURIComponent(`[한울플래닝] 의류제작 문의 - ${data.get("company") || ""}`);
  const body = encodeURIComponent(
`업체명: ${data.get("company")}
카테고리: ${data.get("category")}
제작 품목: ${data.get("item")}

제작 참고사항:
${data.get("detail")}

예상 수량/예산: ${data.get("qty") || "-"}
연락처: ${data.get("phone")}
이메일: ${data.get("email")}
`);

  // 여기 이메일 주소만 회사용으로 바꾸면 됨
  const form = document.getElementById("inquiryForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (res.ok) {
      alert("문의가 접수되었습니다. 빠르게 회신드리겠습니다!");
      form.reset();
    } else {
      alert("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  } catch (err) {
    alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

});
