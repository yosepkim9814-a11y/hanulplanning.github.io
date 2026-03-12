(function(){
  const root = document.documentElement;
  const storageKey = 'hanulSiteLang';
  const defaultLang = 'ko';

  function safeGetStoredLang(){
    try{ return window.localStorage ? localStorage.getItem(storageKey) : null; }
    catch(err){ return null; }
  }

  function safeSetStoredLang(lang){
    try{ if(window.localStorage) localStorage.setItem(storageKey, lang); }
    catch(err){}
  }

  function getLangFromUrl(){
    try{
      const value = new URL(window.location.href).searchParams.get('lang');
      return value === 'en' || value === 'ko' ? value : null;
    }catch(err){
      return null;
    }
  }

  let currentLang = getLangFromUrl() || safeGetStoredLang() || defaultLang;
  currentLang = currentLang === 'en' ? 'en' : 'ko';

  function updateUrlLang(){
    try{
      const url = new URL(window.location.href);
      if(currentLang === 'en') url.searchParams.set('lang', 'en');
      else url.searchParams.delete('lang');
      window.history.replaceState({}, '', url.toString());
    }catch(err){}
  }

  function updateInternalLinks(){
    document.querySelectorAll('a[href]').forEach((link)=>{
      const rawHref = link.getAttribute('href');
      if(!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;
      try{
        const url = new URL(rawHref, window.location.href);
        if(url.origin !== window.location.origin) return;
        const looksLikePage = url.pathname.endsWith('.html') || url.pathname.endsWith('/');
        if(!looksLikePage) return;
        if(currentLang === 'en') url.searchParams.set('lang', 'en');
        else url.searchParams.delete('lang');
        link.setAttribute('href', url.pathname + url.search + url.hash);
      }catch(err){}
    });
  }

  function setMenuAria(menuButton, expanded){
    if(!menuButton) return;
    const key = expanded ? (currentLang === 'ko' ? 'ariaCloseKo' : 'ariaCloseEn') : (currentLang === 'ko' ? 'ariaOpenKo' : 'ariaOpenEn');
    if(menuButton.dataset[key]) menuButton.setAttribute('aria-label', menuButton.dataset[key]);
  }

  function setTextValue(el, text){
    if(el.tagName === 'TITLE'){
      document.title = text;
      return;
    }
    if(el.tagName === 'META'){
      el.setAttribute('content', text);
      return;
    }
    if(el.matches('input[type="button"], input[type="submit"], input[type="reset"]')){
      el.value = text;
      return;
    }
    if(el.hasAttribute('data-lang-html')){
      el.innerHTML = text;
      return;
    }
    el.textContent = text;
  }

  function updateAttribute(selector, attrName, enKey, koKey){
    document.querySelectorAll(selector).forEach((el)=>{
      const value = currentLang === 'ko' ? el.dataset[koKey] : el.dataset[enKey];
      if(typeof value !== 'string') return;
      if(attrName === 'data-caption') el.dataset.caption = value;
      else el.setAttribute(attrName, value);
    });
  }

  function applyLanguage(lang){
    currentLang = lang === 'en' ? 'en' : 'ko';
    root.setAttribute('lang', currentLang);
    root.setAttribute('data-lang', currentLang);
    document.body && document.body.setAttribute('data-lang', currentLang);

    document.querySelectorAll('[data-lang-en][data-lang-ko]').forEach((el)=>{
      const text = currentLang === 'ko' ? el.dataset.langKo : el.dataset.langEn;
      if(typeof text === 'string') setTextValue(el, text);
    });

    updateAttribute('[data-placeholder-en][data-placeholder-ko]', 'placeholder', 'placeholderEn', 'placeholderKo');
    updateAttribute('[data-alt-en][data-alt-ko]', 'alt', 'altEn', 'altKo');
    updateAttribute('[data-caption-en][data-caption-ko]', 'data-caption', 'captionEn', 'captionKo');
    updateAttribute('[data-aria-label-en][data-aria-label-ko]', 'aria-label', 'ariaLabelEn', 'ariaLabelKo');

    document.querySelectorAll('.lang-btn').forEach((btn)=>{
      const active = btn.dataset.setLang === currentLang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const menuButton = document.getElementById('menuToggle');
    if(menuButton) setMenuAria(menuButton, menuButton.getAttribute('aria-expanded') === 'true');

    const body = document.body;
    if(body){
      const title = currentLang === 'ko' ? body.dataset.pageTitleKo : body.dataset.pageTitleEn;
      if(title) document.title = title;
    }

    updateInternalLinks();
    updateUrlLang();
    safeSetStoredLang(currentLang);
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
    wrapper.innerHTML = '\n      <button type="button" class="lightbox-close" aria-label="Close image">×</button>\n      <figure class="lightbox-figure">\n        <img src="" alt="" />\n        <figcaption></figcaption>\n      </figure>';
    document.body.appendChild(wrapper);
    const img = wrapper.querySelector('img');
    const caption = wrapper.querySelector('figcaption');
    const closeBtn = wrapper.querySelector('.lightbox-close');

    const open = (src, cap, alt) => {
      img.src = src;
      img.alt = alt || cap || '';
      caption.textContent = cap || '';
      closeBtn.setAttribute('aria-label', currentLang === 'ko' ? '이미지 닫기' : 'Close image');
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
