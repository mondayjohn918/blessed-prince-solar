/* Blessed Prince B. Solar System: small, dependency-free behaviour for all five pages. */
(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const WA = 'https://wa.me/2347038895712?text=';

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* Menu: a full-screen sheet on phones */
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  if (menuBtn && nav) {
    const label = $('span', menuBtn);
    const setOpen = open => {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'close' : 'menu';
      doc.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); menuBtn.focus(); }
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  }

  /* The one signature move: the first photograph opens like a shutter */
  const openShutters = () => $$('.shutter').forEach(el => el.classList.add('is-in'));

  /* Logo entrance: the head script adds .intro on the first Home visit of a session */
  const intro = $('.intro-screen');
  if (intro && doc.classList.contains('intro')) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      doc.classList.add('intro-out');
      setTimeout(openShutters, 350);
      setTimeout(() => { doc.classList.remove('intro', 'intro-out'); intro.remove(); }, 1000);
    };
    try { sessionStorage.setItem('bpb-intro', '1'); } catch (e) { /* storage blocked: the intro may replay */ }
    $('.intro-skip', intro).addEventListener('click', finish);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') finish(); }, { once: true });
    setTimeout(finish, 2500);
  } else {
    if (intro) intro.remove();
    requestAnimationFrame(() => setTimeout(openShutters, 120));
    setTimeout(openShutters, 600);
  }

  /* Entrances: the parts of each section rise in once, in order */
  const groups = $$('[data-in]');
  if (groups.length && 'IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    groups.forEach(el => io.observe(el));
  } else groups.forEach(el => el.classList.add('is-in'));

  /* How 24/7 works: horizontal accordion (vertical on phones) */
  $$('.acc').forEach(acc => {
    const panels = $$('.acc-panel', acc);
    const open = p => panels.forEach(q => {
      const on = q === p;
      q.classList.toggle('open', on);
      $('.acc-btn', q).setAttribute('aria-expanded', String(on));
    });
    panels.forEach(p => $('.acc-btn', p).addEventListener('click', () => open(p)));
  });

  /* Photo strip drifts with the scroll, so nothing moves on its own */
  const strip = $('.strip');
  if (strip && !reduce) {
    let ticking = false;
    const move = () => {
      ticking = false;
      const r = strip.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      strip.style.transform = `translateX(${(-Math.min(1, Math.max(0, p)) * 18).toFixed(2)}%)`;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
    move();
  }

  /* Quote bar: sends the visitor's answers to WhatsApp */
  const bar = $('#quote-bar');
  if (bar) {
    bar.addEventListener('submit', e => {
      e.preventDefault();
      const name = bar.elements.name.value.trim();
      const need = bar.elements.need.value;
      const msg = `Hello Blessed Prince B,${name ? ` my name is ${name}.` : ''} I want ${need}. Please give me a quote.`;
      window.open(WA + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* Projects: filter + lightbox */
  const gallery = $('.gallery');
  if (gallery) {
    const items = $$('button', gallery);
    const filterBtns = $$('.filters button');
    filterBtns.forEach(btn => {
      const f = btn.dataset.filter;
      const n = f === 'all' ? items.length : items.filter(it => it.dataset.cat.split(' ').includes(f)).length;
      btn.insertAdjacentHTML('beforeend', ` <span class="count">${n}</span>`);
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        items.forEach(it => { it.hidden = !(f === 'all' || it.dataset.cat.split(' ').includes(f)); });
        const live = $('#filter-status');
        if (live) live.textContent = `Showing ${n} photo${n === 1 ? '' : 's'}`;
      });
    });

    const lb = $('#lightbox');
    const lbImg = $('img', lb);
    const lbCap = $('figcaption', lb);
    let current = 0;
    const visible = () => items.filter(it => !it.hidden);
    const show = it => {
      lbImg.src = it.dataset.full;
      lbImg.alt = $('img', it).alt;
      lbCap.textContent = $('span', it).textContent;
      current = visible().indexOf(it);
      if (!lb.open) lb.showModal();
    };
    items.forEach(it => it.addEventListener('click', () => show(it)));
    const step = d => { const v = visible(); show(v[(current + d + v.length) % v.length]); };
    $('[data-lb="prev"]', lb).addEventListener('click', () => step(-1));
    $('[data-lb="next"]', lb).addEventListener('click', () => step(1));
    $('[data-lb="close"]', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* Contact: rough system-size guide */
  const calc = $('#calc');
  if (calc) {
    const rows = $$('[data-w]', calc);
    const hours = $('#night-hours');
    const hoursOut = $('#night-hours-out');
    const out = { load: $('#r-load'), kva: $('#r-kva'), batt: $('#r-batt'), panels: $('#r-panels'), wa: $('#r-wa') };
    const sizes = [1.5, 2.5, 3.5, 5, 7.5, 10, 15, 20];
    const fmt = n => n.toLocaleString('en-NG');

    function compute() {
      let watts = 0, motor = 0;
      const picked = [];
      rows.forEach(row => {
        const n = +$('output', row).value;
        if (n) {
          watts += n * +row.dataset.w;
          if (row.dataset.motor) motor = Math.max(motor, +row.dataset.w);
          picked.push(`${n} x ${row.dataset.name}`);
        }
      });
      const h = +hours.value;
      hoursOut.textContent = `${h} hours`;
      out.load.textContent = `${fmt(watts)} W if everything runs at once`;
      if (!watts) {
        out.kva.textContent = out.batt.textContent = out.panels.textContent = '0';
      } else {
        // Inverter: 25% headroom over the running load, or room for the biggest motor
        // (AC, fridge, pump) to start, whichever is more; 0.8 power factor
        const need = Math.max(watts * 1.25, watts + motor * 1.5) / 0.8 / 1000;
        const kva = sizes.find(s => s >= need) || sizes[sizes.length - 1];
        // Night energy: assume about 60% of the load is on through the night
        const nightKwh = watts * 0.6 * h / 1000;
        // 12V 220Ah tubular battery = 2.64 kWh, use half to keep it healthy
        const batts = Math.max(2, Math.ceil(nightKwh / 1.32 / 2) * 2);
        // Panels: refill the batteries plus run half the load for 6 daylight hours, ~4.5 sun hours, 550 W panels
        const dayKwh = nightKwh + watts * 0.5 * 6 / 1000;
        const panels = Math.max(2, Math.ceil(dayKwh / (0.55 * 4.5 * 0.8)));
        out.kva.textContent = need > 20 ? '20+' : `${kva}`;
        out.batt.textContent = `${batts}`;
        out.panels.textContent = `${panels}`;
      }
      const msg = watts
        ? `Hello Blessed Prince B, I used the size guide on your website.\n\nI want to power: ${picked.join(', ')}.\nThrough the night for about ${h} hours.\nThe guide suggested ${out.kva.textContent} kVA, ${out.batt.textContent} batteries and ${out.panels.textContent} panels.\n\nPlease give me a quote.`
        : 'Hello Blessed Prince B, I want a quote for a solar system.';
      out.wa.href = WA + encodeURIComponent(msg);
    }

    rows.forEach(row => {
      const o = $('output', row);
      const [minus, plus] = $$('button', row);
      const set = v => {
        v = Math.max(0, Math.min(20, v));
        o.value = o.textContent = v;
        minus.disabled = v === 0;
        compute();
      };
      minus.addEventListener('click', () => set(+o.value - 1));
      plus.addEventListener('click', () => set(+o.value + 1));
      minus.disabled = +o.value === 0;
    });
    hours.addEventListener('input', compute);
    compute();
  }
})();
