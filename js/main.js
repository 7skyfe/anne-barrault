(() => {
  const root = document.documentElement;

  /* ---------- Thème clair / sombre ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ab-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('ab-theme', next);
  });

  /* ---------- Mode glass (meilleures performances) — ON par défaut ---------- */
  const glassToggle = document.getElementById('glassToggle');
  const savedGlass = localStorage.getItem('ab-glass');
  if (savedGlass) root.dataset.glass = savedGlass;

  const syncGlassLabel = () => {
    const isOn = root.dataset.glass === 'on';
    glassToggle.setAttribute('aria-pressed', String(isOn));
    const state = glassToggle.querySelector('.glass-toggle__state');
    if (state) state.textContent = isOn ? 'on' : 'off';
  };
  syncGlassLabel();

  glassToggle.addEventListener('click', () => {
    root.dataset.glass = root.dataset.glass === 'on' ? 'off' : 'on';
    localStorage.setItem('ab-glass', root.dataset.glass);
    syncGlassLabel();
  });

  /* ---------- Menu plein écran ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuClose = document.getElementById('menuClose');

  const openMenu = () => {
    menuOverlay.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    menuOverlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', openMenu);
  // Fermeture par appui sur le fond : la croix seule etait hors de portee du pouce
  menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) closeMenu(); });
  menuClose.addEventListener('click', closeMenu);
  menuOverlay.querySelectorAll('.menu-list a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) closeMenu();
  });

  /* ---------- Carousel "Projection déjà passée" — vrai slide en transform ---------- */
  const track = document.getElementById('carouselTrack');
  const viewport = document.querySelector('.carousel-viewport');
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');
  if (track && viewport && prevBtn && nextBtn) {
    const cards = Array.from(track.children);
    let index = cards.findIndex(c => c.classList.contains('is-active'));
    if (index < 0) index = 0;

    // Points de progression : les testeurs ne savaient pas combien de cartes restaient
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    cards.forEach((_, n) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'carousel-dot';
      d.setAttribute('aria-label', 'Aller a la projection ' + (n + 1));
      d.addEventListener('click', () => goTo(n));
      dots.appendChild(d);
    });
    viewport.closest('.carousel').insertAdjacentElement('afterend', dots);

    const goTo = (i) => {
      index = (i + cards.length) % cards.length;
      cards.forEach((c, n) => c.classList.toggle('is-active', n === index));
      Array.from(dots.children).forEach((d, n) => d.classList.toggle('is-active', n === index));
      const card = cards[index];
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      // centre la carte active dans le viewport
      const offset = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
      track.style.transform = `translateX(${-offset}px)`;
    };

    nextBtn.addEventListener('click', () => goTo(index + 1));
    prevBtn.addEventListener('click', () => goTo(index - 1));

    // Glissement au doigt : les 2 testeurs sur mobile ont essaye de glisser avant
    // de voir les fleches. Seuil de 45 px pour ne pas declencher sur un simple appui.
    let startX = 0, startY = 0, tracking = false;
    viewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goTo(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
    window.addEventListener('resize', () => goTo(index));

    // position initiale — plusieurs déclencheurs redondants pour ne jamais
    // rater le moment où le layout (polices, images) est stabilisé
    goTo(index);
    requestAnimationFrame(() => goTo(index));
    window.addEventListener('load', () => goTo(index));
  }

  /* ---------- Rubrique active dans la navigation ---------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-inline a, .menu-list a').forEach((a) => {
    const target = a.getAttribute('href');
    if (target && target === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Filtre + recherche (Expositions / Artistes) ---------- */
  const filterToggle = document.getElementById('filterToggle');
  const filterDropdown = document.getElementById('filterDropdown');
  if (filterToggle && filterDropdown) {
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = filterDropdown.classList.toggle('is-open');
      filterToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', (e) => {
      if (!filterDropdown.contains(e.target) && e.target !== filterToggle) {
        filterDropdown.classList.remove('is-open');
        filterToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const filterSearch = document.getElementById('filterSearch');
  const filterItems = document.querySelectorAll('[data-filter-item]');
  const categoryChecks = filterDropdown ? filterDropdown.querySelectorAll('input[type="checkbox"]') : [];

  if (filterItems.length) {
    const applyFilters = () => {
      const query = filterSearch ? filterSearch.value.trim().toLowerCase() : '';
      const activeCategories = Array.from(categoryChecks).filter(c => c.checked).map(c => c.value);
      filterItems.forEach((item) => {
        const text = (item.dataset.search || '').toLowerCase();
        const category = item.dataset.category || '';
        const matchesQuery = !query || text.includes(query);
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(category);
        item.style.display = (matchesQuery && matchesCategory) ? '' : 'none';
      });
    };
    if (filterSearch) filterSearch.addEventListener('input', applyFilters);
    categoryChecks.forEach((c) => c.addEventListener('change', applyFilters));
  }
})();
