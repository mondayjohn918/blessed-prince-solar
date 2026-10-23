/* Blessed Prince B. Solar System: small, dependency-free behaviour for all five pages. */
(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* Mobile menu */
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  if (menuBtn && nav) {
    const setOpen = open => {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); menuBtn.focus(); }
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  }

  /* Hero: the street light catches and the photo comes up out of the dark */
  const hero = $('.hero');
  if (hero) {
    const img = $('.lamp-scene img', hero);
    const light = () => doc.classList.add('lit');
    if (reduce || !img) light();
    else if (img.complete) setTimeout(light, 250);
    else { img.addEventListener('load', () => setTimeout(light, 150), { once: true }); setTimeout(light, 2500); }
  }

  /* Reveal on scroll, used sparingly */
  const reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  /* Services index: the arched photo follows the row you point at or tab to */
  const svcList = $('.svc-list');
  if (svcList) {
    const imgs = $$('.svc-figure img');
    const cap = $('.svc-figure figcaption');
    const links = $$('a', svcList);
    const show = i => {
      imgs.forEach((im, j) => im.classList.toggle('on', j === i));
      links.forEach((a, j) => a.classList.toggle('on', j === i));
      if (cap && imgs[i]) cap.textContent = imgs[i].dataset.caption || '';
    };
    links.forEach((a, i) => {
      a.addEventListener('mouseenter', () => show(i));
      a.addEventListener('focus', () => show(i));
    });
    show(0);
  }

  /* The 24-hour scroll scene */
  const day = $('.day');
  if (day) {
    const stages = $$('.stage', day);
    if (reduce) {
      day.classList.add('static');
    } else {
      const hand = $('#dial-hand', day);
      const read = $('#dial-read', day);
      const sub = $('#dial-sub', day);
      const sunArc = $('#arc-sun', day);
      const battArc = $('#arc-batt', day);
      const sky = $('.day-sky', day);
      const prog = $('.day-progress', day);
      const R = 170, C = 2 * Math.PI * R;
      // Hours on the dial run from 06:00 round to 06:00 the next morning.
      const stops = [
        [6, ['#2A1530', '#7A4A6B', '#E59A6B']],
        [12, ['#3E3A86', '#5A6CC0', '#9DB4E8']],
        [18, ['#2A1530', '#8C3F4F', '#E2774F']],
        [24, ['#120914', '#1E0F24', '#2A1530']],
        [30, ['#1E0F24', '#4A2650', '#C9786B']],
      ];
      const mix = (a, b, t) => {
        const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
        const ch = s => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * t);
        return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
      };
      const skyAt = h => {
        let i = 0;
        while (i < stops.length - 2 && h > stops[i + 1][0]) i++;
        const [h0, c0] = stops[i], [h1, c1] = stops[i + 1];
        const t = Math.min(1, Math.max(0, (h - h0) / (h1 - h0)));
        return `linear-gradient(180deg, ${mix(c0[0], c1[0], t)} 0%, ${mix(c0[1], c1[1], t)} 60%, ${mix(c0[2], c1[2], t)} 100%)`;
      };
      const labels = ['Panels waking up', 'Panels carrying the house', 'Grid off, inverter on', 'Running on batteries'];
      let ticking = false;
      const update = () => {
        ticking = false;
        const r = day.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / total));
        const hour = 6 + p * 24;
        const hh = Math.floor(hour) % 24, mm = Math.floor((hour % 1) * 60 / 15) * 15;
        read.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
        hand.setAttribute('transform', `rotate(${(hour - 12) / 24 * 360} 200 200)`);
        // Noon sits at the top: the sun arc fills 06:00 to 18:00 over the top, the battery arc 18:00 to 06:00 underneath
        const sunP = Math.min(1, Math.max(0, (hour - 6) / 12));
        const battP = Math.min(1, Math.max(0, (hour - 18) / 12));
        sunArc.style.strokeDasharray = `${C / 2 * sunP} ${C}`;
        battArc.style.strokeDasharray = `${C / 2 * battP} ${C}`;
        const idx = Math.min(stages.length - 1, Math.floor(p * stages.length));
        stages.forEach((s, i) => s.classList.toggle('on', i === idx));
        sub.textContent = labels[idx];
        sky.style.setProperty('--sky', skyAt(hour));
        prog.style.setProperty('--p', p.toFixed(4));
      };
      window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
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
    const open = it => {
      const im = $('img', it);
      lbImg.src = it.dataset.full;
      lbImg.alt = im.alt;
      lbCap.textContent = $('span', it).textContent;
      current = visible().indexOf(it);
      if (!lb.open) lb.showModal();
    };
    items.forEach(it => it.addEventListener('click', () => open(it)));
    const step = d => { const v = visible(); open(v[(current + d + v.length) % v.length]); };
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
    const out = {
      load: $('#r-load'), kva: $('#r-kva'), batt: $('#r-batt'), panels: $('#r-panels'), wa: $('#r-wa'),
    };
    const sizes = [1.5, 2.5, 3.5, 5, 7.5, 10, 15, 20];
    const fmt = n => n.toLocaleString('en-NG');

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
        out.kva.textContent = out.batt.textContent = out.panels.textContent = '–';
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
        out.kva.textContent = need > 20 ? '20+ kVA' : `${kva} kVA`;
        out.batt.textContent = `${batts}`;
        out.panels.textContent = `${panels}`;
      }
      const msg = watts
        ? `Hello Blessed Prince B, I used the size guide on your website.\n\nI want to power: ${picked.join(', ')}.\nThrough the night for about ${h} hours.\nThe guide suggested ${out.kva.textContent}, ${out.batt.textContent} batteries and ${out.panels.textContent} panels.\n\nPlease give me a quote.`
        : 'Hello Blessed Prince B, I want a quote for a solar system.';
      out.wa.href = `https://wa.me/2347038895712?text=${encodeURIComponent(msg)}`;
    }
    compute();
  }
})();
