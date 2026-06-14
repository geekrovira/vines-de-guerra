// ============================================================
// ✈️ VINES DE GUERRA — Aviones Militares Modernos
// ============================================================

(function() {
  'use strict';

  function hexToRgb(hex) {
    const s = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (s) hex = '#' + s[1]+s[1] + s[2]+s[2] + s[3]+s[3];
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '232,73,29';
  }

  // ─── NAVBAR ───
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    if (cur > lastScrollY && cur > 100) navbar.classList.add('hidden');
    else navbar.classList.remove('hidden');
    lastScrollY = cur;
  });

  // ─── ERA FILTERS ───
  const eraBtns = document.querySelectorAll('.era-btn');
  let activeEra = 'all';

  eraBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      eraBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeEra = btn.dataset.era;
      renderFeed();
    });
  });

  // ─── VIEW TOGGLE ───
  const viewBtns = document.querySelectorAll('.view-btn');
  const feed = document.getElementById('warFeed');
  let currentView = 'grid';

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      feed.className = 'war-feed ' + currentView;
      observeCards();
    });
  });

  // ─── RENDER ───
  function renderFeed() {
    const filtered = activeEra === 'all'
      ? warVines
      : warVines.filter(v => v.generation === activeEra);

    feed.innerHTML = '';
    filtered.forEach((vine, idx) => {
      const card = document.createElement('div');
      card.className = 'war-card';
      card.style.setProperty('--card-color', vine.color);
      card.style.setProperty('--card-rgb', hexToRgb(vine.color));
      card.dataset.idx = idx;

      const rgb = hexToRgb(vine.color);
      card.innerHTML = `
        <div class="card-top">
          <span class="card-icon">${vine.image}</span>
          <span class="card-era-badge" style="color:${vine.color};border-color:rgba(${rgb},0.2)">${vine.generation}</span>
        </div>
        <div class="card-body">
          <div class="card-conflict">${vine.country} · ${vine.type}</div>
          <div class="card-title">${vine.title}</div>
          <span class="card-year">${vine.year}</span>
          <div class="card-short">${vine.short}</div>
          <div class="card-stat-mini">${vine.stat}</div>
        </div>
      `;

      card.addEventListener('click', () => openModal(vine));
      feed.appendChild(card);
    });

    if (currentView === 'list') {
      const cards = Array.from(feed.children);
      cards.sort((a, b) => {
        const vA = warVines.find(v => v.title === a.querySelector('.card-title').textContent);
        const vB = warVines.find(v => v.title === b.querySelector('.card-title').textContent);
        return vA && vB ? parseFloat(vA.id) - parseFloat(vB.id) : 0;
      });
      cards.forEach(c => feed.appendChild(c));
    }

    document.getElementById('feedCount').textContent = `Mostrando ${filtered.length} de ${warVines.length}`;
    observeCards();
  }

  // ─── INTERSECTION OBSERVER ───
  let observer;
  function observeCards() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.war-card:not(.visible)').forEach(c => observer.observe(c));
  }

  // ─── SCROLL HINT ───
  const scrollHint = document.getElementById('scrollHint');
  window.addEventListener('scroll', () => {
    scrollHint.style.opacity = window.scrollY > 200 ? '0' : '1';
    scrollHint.style.transition = 'opacity 0.5s';
  });

  // ─── MODAL ───
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function openModal(vine) {
    document.getElementById('modalIcon').textContent = vine.image;
    document.getElementById('modalTitle').textContent = vine.title;
    document.getElementById('modalConflict').textContent = vine.country + ' · ' + vine.type;
    document.getElementById('modalCountry').textContent = vine.country + ' · ' + vine.generation;
    document.getElementById('modalYear').textContent = vine.year;
    document.getElementById('modalShort').textContent = vine.short;
    document.getElementById('modalStat').textContent = vine.stat;
    document.getElementById('modalImpact').textContent = vine.impact;
    document.getElementById('modalEraBadge').textContent = `// ${vine.generation} · ${vine.country}`;

    const storyEl = document.getElementById('modalStory');
    storyEl.textContent = '';
    let i = 0;
    const text = vine.full;
    function typeStory() {
      if (i < text.length) {
        storyEl.textContent += text[i];
        i++;
        setTimeout(typeStory, 3 + Math.random() * 5);
      }
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(typeStory, 250);
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ─── RANDOM ───
  document.getElementById('btnRandom').addEventListener('click', () => {
    openModal(warVines[Math.floor(Math.random() * warVines.length)]);
  });

  // ─── EASTER EGG ───
  const dot = document.getElementById('easterDot');
  let dotClicks = 0;
  dot.addEventListener('click', () => {
    dotClicks++;
    if (dotClicks >= 5) {
      dotClicks = 0;
      console.log('%c✈️ VINES DE GUERRA — AVIONES', 'font-size:24px; color:#e8491d; font-weight:bold; font-family:Orbitron');
      console.log('%cHas desbloqueado el modo Top Gun.', 'color:#f39c12; font-size:16px');
      console.log('%c           __', 'color:#3498db; font-size:12px');
      console.log('%c          / \\', 'color:#3498db; font-size:12px');
      console.log('%c         /   \\', 'color:#3498db; font-size:12px');
      console.log('%c        /     \\', 'color:#3498db; font-size:12px');
      console.log('%c       /_______\\', 'color:#3498db; font-size:12px');
      console.log('%c      |  █████  |  — F-14 Tomcat', 'color:#e8491d; font-size:12px');
      console.log('%c Feel the need... the need for speed!', 'color:#f1c40f; font-size:14px');

      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle,rgba(232,73,29,0.3),transparent);z-index:9999;pointer-events:none;animation:fadeOut 2s ease forwards';
      flash.innerHTML = '<style>@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}</style>';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 2000);
    }
  });

  // ─── KONAMI CODE → NIGHT OPS ───
  let konami = [];
  const kSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  document.addEventListener('keydown', (e) => {
    konami.push(e.key);
    if (konami.length > kSeq.length) konami.shift();
    if (konami.join(',') === kSeq.join(',')) {
      konami = [];
      document.body.style.filter = 'invert(1) hue-rotate(180deg)';
      document.body.style.transition = 'filter 0.5s';
      setTimeout(() => { document.body.style.filter = 'invert(0) hue-rotate(0deg)'; }, 3000);
      console.log('%c🎮 KONAMI — Stealth Mode Activated', 'color:#f39c12; font-size:14px');
    }
  });

  // ─── COUNTER ───
  const totalSpan = document.getElementById('totalWars');
  let c = 0;
  const ci = setInterval(() => {
    c++;
    totalSpan.textContent = c;
    if (c >= warVines.length) clearInterval(ci);
  }, 30);

  // ─── CONSOLE ───
  console.log('%c✈️ VINES DE GUERRA — AVIONES MILITARES MODERNOS', 'font-size:20px; color:#e8491d; font-weight:bold; font-family:Orbitron');
  console.log('%c40 aeronaves. 70+ años de historia. 15+ países.', 'color:#999; font-size:13px');
  console.log('%cEncuentra el punto rojo en la esquina...', 'color:#f39c12; font-size:12px');

  // ─── INIT ───
  renderFeed();
})();
