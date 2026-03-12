(function(){
  const root = document.documentElement;
  const storageKey = 'hanulSiteLang';
  const defaultLang = 'ko';
  let currentLang = localStorage.getItem(storageKey) || defaultLang;

  function setMenuAria(menuButton, expanded){
    if(!menuButton) return;
    const lang = currentLang;
    const key = expanded ? (lang === 'ko' ? 'ariaCloseKo' : 'ariaCloseEn') : (lang === 'ko' ? 'ariaOpenKo' : 'ariaOpenEn');
    if(menuButton.dataset[key]) menuButton.setAttribute('aria-label', menuButton.dataset[key]);
  }

  function applyLanguage(lang){
    currentLang = lang === 'en' ? 'en' : 'ko';
    root.setAttribute('lang', currentLang);
    root.setAttribute('data-lang', currentLang);
    document.querySelectorAll('[data-lang-en][data-lang-ko]').forEach((el)=>{
      const text = currentLang === 'ko' ? el.dataset.langKo : el.dataset.langEn;
      if(el.tagName === 'TITLE'){
        document.title = text;
      } else if(!el.children.length){
        el.textContent = text;
      }
    });
    document.querySelectorAll('[data-placeholder-en][data-placeholder-ko]').forEach((el)=>{
      el.setAttribute('placeholder', currentLang === 'ko' ? el.dataset.placeholderKo : el.dataset.placeholderEn);
    });
    document.querySelectorAll('.lang-btn').forEach((btn)=>{
      btn.classList.toggle('is-active', btn.dataset.setLang === currentLang);
      btn.setAttribute('aria-pressed', btn.dataset.setLang === currentLang ? 'true' : 'false');
    });
    document.querySelectorAll('.gallery-item, .p-card').forEach((el)=>{
      el.setAttribute('data-view-label', currentLang === 'ko' ? '확대 보기' : 'View');
    });
    const menuButton = document.getElementById('menuToggle');
    if(menuButton) setMenuAria(menuButton, menuButton.getAttribute('aria-expanded') === 'true');
    localStorage.setItem(storageKey, currentLang);
  }

  function initLanguageButtons(){
    document.querySelectorAll('.lang-btn').forEach((btn)=>{
      btn.addEventListener('click', ()=> applyLanguage(btn.dataset.setLang));
    });
    applyLanguage(currentLang);
  }

  function initHeaderScroll(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    const onScroll = ()=>{
      if(window.scrollY > 18) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  function initMobileMenu(){
    const button = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if(!button || !menu) return;
    const closeMenu = ()=>{
      button.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      setMenuAria(button, false);
    };
    button.addEventListener('click', ()=>{
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open', !expanded);
      setMenuAria(button, !expanded);
    });
    menu.querySelectorAll('a').forEach((link)=> link.addEventListener('click', closeMenu));
    window.addEventListener('resize', ()=>{ if(window.innerWidth > 820) closeMenu(); });
  }

  function initReveal(){
    const items = document.querySelectorAll('.reveal');
    if(!items.length) return;
    if(!('IntersectionObserver' in window)){
      items.forEach((el)=>el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.14, rootMargin:'0px 0px -40px 0px'});
    items.forEach((el)=> io.observe(el));
  }

  function initLightbox(){
    const triggers = [...document.querySelectorAll('[data-lightbox], .p-card[data-full]')];
    if(!triggers.length) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'lightbox';
    wrapper.setAttribute('role','dialog');
    wrapper.setAttribute('aria-modal','true');
    wrapper.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close image">×</button>
      <figure class="lightbox-figure">
        <img src="" alt="" />
        <figcaption></figcaption>
      </figure>`;
    document.body.appendChild(wrapper);
    const img = wrapper.querySelector('img');
    const caption = wrapper.querySelector('figcaption');
    const closeBtn = wrapper.querySelector('.lightbox-close');

    const open = (src, cap, alt) => {
      img.src = src;
      img.alt = alt || cap || '';
      caption.textContent = cap || '';
      wrapper.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      wrapper.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(()=>{ img.src = ''; }, 150);
    };
    triggers.forEach((el)=>{
      el.addEventListener('click', ()=>{
        const src = el.dataset.lightbox || el.dataset.full;
        const cap = el.dataset.caption || el.querySelector('img')?.alt || '';
        const alt = el.querySelector('img')?.alt || cap || '';
        if(src) open(src, cap, alt);
      });
    });
    closeBtn.addEventListener('click', close);
    wrapper.addEventListener('click', (e)=>{ if(e.target === wrapper) close(); });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && wrapper.classList.contains('is-open')) close();
    });
  }

  function initInquiryForm(){
    const form = document.getElementById('inquiryForm');
    const status = document.getElementById('formStatus');
    if(!form || !status) return;
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      status.textContent = currentLang === 'ko' ? '문의 내용을 전송 중입니다...' : 'Sending your inquiry...';
      try{
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if(response.ok){
          form.reset();
          status.textContent = currentLang === 'ko'
            ? '문의가 정상적으로 전송되었습니다. 빠르게 회신드리겠습니다.'
            : 'Your inquiry has been sent successfully. We will get back to you soon.';
        } else {
          throw new Error('request failed');
        }
      }catch(err){
        status.textContent = currentLang === 'ko'
          ? '전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
          : 'There was a problem sending your inquiry. Please try again later.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initLanguageButtons();
    initHeaderScroll();
    initMobileMenu();
    initReveal();
    initLightbox();
    initInquiryForm();
  });
})();
