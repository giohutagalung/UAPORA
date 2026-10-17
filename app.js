(() => {
  const config = window.UAPORA_CONFIG || {};
  const maxToppings = Number(config.MAX_TOPPINGS) || 2;
  const state = { flavor: null, ingredient: null, toppings: [] };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const ingredientWrap = $('#ingredient-options');
  const toppingWrap = $('#topping-options');
  const feedback = $('#selection-feedback');
  const toast = $('#toast');
  let toastTimer;

  $('#year').textContent = new Date().getFullYear();
  $('#max-toppings-label').textContent = maxToppings;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function renderIngredients() {
    if (!state.flavor) {
      ingredientWrap.innerHTML = '<p class="empty-hint">Pilih jalur rasa terlebih dahulu untuk melihat pilihan bahan.</p>';
      return;
    }
    const items = (config.ingredients?.[state.flavor] || []);
    ingredientWrap.innerHTML = items.map(item => `
      <button class="ingredient-option ${state.ingredient === item.id ? 'selected' : ''}" data-ingredient="${item.id}" aria-pressed="${state.ingredient === item.id}" style="--ingredient-color:${item.color}">
        <span class="ingredient-art" aria-hidden="true"><span class="ingredient-shape shape-${item.id}"></span></span>
        <span class="ingredient-name">${item.name}</span><span class="ingredient-note">${item.note}</span>
        <span class="ingredient-check" aria-hidden="true">✓</span>
      </button>`).join('');
    $$('.ingredient-option', ingredientWrap).forEach(button => button.addEventListener('click', () => {
      state.ingredient = button.dataset.ingredient;
      renderIngredients();
      updatePreview();
    }));
  }

  function renderToppings() {
    if (!state.flavor) {
      toppingWrap.innerHTML = '<p class="empty-hint">Pilihan pelengkap akan muncul setelah jalur rasa dipilih.</p>';
      return;
    }
    const items = config.toppings?.[state.flavor] || [];
    toppingWrap.innerHTML = items.map(item => {
      const selected = state.toppings.includes(item.id);
      const blocked = !selected && state.toppings.length >= maxToppings;
      return `<button class="topping-option ${selected ? 'selected' : ''} ${blocked ? 'blocked' : ''}" data-topping="${item.id}" aria-pressed="${selected}" ${blocked ? 'aria-disabled="true"' : ''}><span class="topping-check">${selected ? '✓' : '+'}</span><span class="topping-copy"><strong>${item.name}</strong><small>${item.note}</small></span></button>`;
    }).join('');
    $$('.topping-option', toppingWrap).forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.topping;
      if (state.toppings.includes(id)) {
        state.toppings = state.toppings.filter(item => item !== id);
        feedback.textContent = '';
      } else if (state.toppings.length >= maxToppings) {
        feedback.textContent = `Maksimal ${maxToppings} pelengkap. Hapus salah satu pilihan untuk menggantinya.`;
        return;
      } else {
        state.toppings.push(id);
        feedback.textContent = '';
      }
      renderToppings();
      updatePreview();
    }));
  }

  function selectedIngredientName() {
    const items = config.ingredients?.[state.flavor] || [];
    return items.find(item => item.id === state.ingredient)?.name || null;
  }
  function selectedToppingNames() {
    const items = config.toppings?.[state.flavor] || [];
    return state.toppings.map(id => items.find(item => item.id === id)?.name).filter(Boolean);
  }

  function updatePreview() {
    $$('.flavor-option').forEach(button => {
      const active = button.dataset.flavor === state.flavor;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#summary-flavor').textContent = state.flavor ? (state.flavor === 'gurih' ? 'UAPORA Gurih' : 'UAPORA Manis') : 'Belum dipilih';
    $('#summary-ingredient').textContent = selectedIngredientName() || 'Belum dipilih';
    const toppingNames = selectedToppingNames();
    $('#summary-toppings').textContent = toppingNames.length ? toppingNames.join(', ') : 'Belum dipilih';
    $('#preview-name').textContent = state.flavor ? (selectedIngredientName() ? `Bowl ${selectedIngredientName()}` : 'Racikan pilihanmu') : 'Mulai dari rasa';
    $('#preview-status').textContent = !state.flavor ? 'Pilih jalur rasa untuk mulai mengeksplorasi.' : !state.ingredient ? 'Sekarang pilih satu bahan dasar untuk melanjutkan.' : 'Ini pilihan simulasi yang masih perlu dievaluasi. Bagikan pendapatmu melalui survei.';
    $('#bowl-stage').classList.toggle('has-flavor', Boolean(state.flavor));
    $('#bowl-stage').classList.toggle('flavor-sweet', state.flavor === 'manis');
    $('#bowl-stage').classList.toggle('has-ingredient', Boolean(state.ingredient));
    $('#bowl-stage').dataset.ingredient = state.ingredient || 'none';
    $('#bowl-stage').dataset.toppings = String(state.toppings.length);
    const food = $('#bowl-food');
    food.style.setProperty('--food-color', state.ingredient === 'ubi' ? '#bd7898' : state.ingredient === 'jagung' || state.ingredient === 'pisang' ? '#f0c84f' : state.ingredient === 'singkong' ? '#f0dfba' : '#e5b97d');
    food.classList.toggle('food-gurih', state.flavor === 'gurih');
    food.classList.toggle('food-manis', state.flavor === 'manis');
    food.querySelectorAll('.food-piece').forEach((piece, i) => piece.classList.toggle('piece-visible', Boolean(state.ingredient) && (i < 4 + state.toppings.length)));
  }

  function chooseFlavor(flavor, scroll = false) {
    if (!['gurih', 'manis'].includes(flavor)) return;
    state.flavor = flavor;
    state.ingredient = null;
    state.toppings = [];
    feedback.textContent = '';
    renderIngredients();
    renderToppings();
    updatePreview();
    if (scroll) $('#racik').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $$('.flavor-option').forEach(button => button.addEventListener('click', () => chooseFlavor(button.dataset.flavor)));
  $$('.choose-flavor').forEach(button => button.addEventListener('click', () => chooseFlavor(button.dataset.flavor, true)));

  $('#reset-builder').addEventListener('click', () => {
    state.flavor = null; state.ingredient = null; state.toppings = [];
    feedback.textContent = '';
    renderIngredients(); renderToppings(); updatePreview();
    showToast('Racikan dikembalikan ke awal.');
  });

  function goToSurvey() {
    const url = (config.GOOGLE_FORM_URL || '').trim();
    if (url && /^https:\/\/(docs\.google\.com\/forms|forms\.gle)\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      $('#survei').scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Tautan Google Form belum dipasang. Bagian survei sudah ditampilkan.');
      $('#survey-config-note').classList.add('attention');
    }
  }
  $('#open-survey').addEventListener('click', goToSurvey);
  $('#survey-from-preview').addEventListener('click', goToSurvey);
  $$('.nav-cta, .hero-actions .button-text').forEach(link => link.addEventListener('click', event => {
    if (!(config.GOOGLE_FORM_URL || '').trim() && link.getAttribute('href') === '#survei') {
      event.preventDefault(); $('#survei').scrollIntoView({ behavior: 'smooth' });
      showToast('Kamu bisa meninjau tujuan survei di bagian ini.');
    }
  }));

  const toggle = $('.menu-toggle');
  const navLinks = $('#nav-links');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
    navLinks.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open'); document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Buka navigasi');
  }));

  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    $$('.reveal').forEach(el => revealObserver.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('revealed'));

  // If no survey URL exists, the site remains a transparent concept prototype.
  if (config.GOOGLE_FORM_URL && /^https:\/\/(docs\.google\.com\/forms|forms\.gle)\//i.test(config.GOOGLE_FORM_URL.trim())) {
    $('#survey-config-note').textContent = 'Tautan survei telah dikonfigurasi. Pastikan formulir dapat diakses sebelum membagikan website.';
    $('#survey-config-note').classList.add('configured');
  }
  renderIngredients(); renderToppings(); updatePreview();
})();
