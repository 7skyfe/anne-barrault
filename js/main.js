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
    glassToggle.querySelector('.glass-toggle__label').textContent = isOn ? 'on' : 'off';
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

    const goTo = (i) => {
      index = (i + cards.length) % cards.length;
      cards.forEach((c, n) => c.classList.toggle('is-active', n === index));
      const card = cards[index];
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      // centre la carte active dans le viewport
      const offset = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
      track.style.transform = `translateX(${-offset}px)`;
    };

    nextBtn.addEventListener('click', () => goTo(index + 1));
    prevBtn.addEventListener('click', () => goTo(index - 1));
    window.addEventListener('resize', () => goTo(index));

    // position initiale — plusieurs déclencheurs redondants pour ne jamais
    // rater le moment où le layout (polices, images) est stabilisé
    goTo(index);
    requestAnimationFrame(() => goTo(index));
    window.addEventListener('load', () => goTo(index));
  }

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
