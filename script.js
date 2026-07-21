(function(){
  "use strict";

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = sessionStorage.getItem('bd-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  let currentTheme = savedTheme || (prefersLight ? 'light' : 'dark');
  applyTheme(currentTheme);

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    sessionStorage.setItem('bd-theme', theme);
  }
  themeToggle.addEventListener('click', function(){
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggler = document.getElementById('navToggler');
  const navLinks = document.getElementById('navLinks');
  const togglerIcon = document.getElementById('togglerIcon');
  navToggler.addEventListener('click', function(){
    const isOpen = navLinks.classList.toggle('open');
    togglerIcon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
  });
  navLinks.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      navLinks.classList.remove('open');
      togglerIcon.className = 'bi bi-list';
    });
  });

  /* ---------- Live clock (Costa Rica) ---------- */
  const clockEl = document.getElementById('localClock');
  function updateClock(){
    try{
      const fmt = new Intl.DateTimeFormat('es-CR', {
        timeZone:'America/Costa_Rica', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
      });
      clockEl.textContent = fmt.format(new Date()) + ' CST';
    }catch(e){
      clockEl.textContent = new Date().toLocaleTimeString();
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---------- Scroll progress + active nav link ---------- */
  const progressBar = document.getElementById('scrollProgress');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = navAnchors.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';

    let currentIndex = -1;
    sections.forEach(function(sec, i){
      if(sec.getBoundingClientRect().top <= 120) currentIndex = i;
    });
    navAnchors.forEach(function(a, i){
      a.classList.toggle('active', i === currentIndex);
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(function(el){ io.observe(el); });

  /* ---------- Hero role typewriter ---------- */
  const roles = [
    'Full Stack Developer',
    'Angular · React · Node.js',
    'PHP · ASP.NET Core',
    'Construyendo APIs REST',
    'Software Engineering Student'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const full = roles[roleIndex];
    if(!deleting){
      charIndex++;
      typedEl.textContent = full.slice(0, charIndex);
      if(charIndex === full.length){
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = full.slice(0, charIndex);
      if(charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 55);
  }
  typeLoop();

  /* ---------- Tech tabs filter ---------- */
  const tabs = document.querySelectorAll('.tech-tab');
  const cards = document.querySelectorAll('.tech-card');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      cards.forEach(function(card){
        const match = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.toggle('show', match);
      });
    });
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

})();