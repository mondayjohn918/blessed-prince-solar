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
  const lightHero = () => {
    if (!hero) return;
    const img = $('.lamp-scene img', hero);
    const light = () => doc.classList.add('lit');
    if (reduce || !img) light();
    else if (img.complete) setTimeout(light, 250);
    else { img.addEventListener('load', () => setTimeout(light, 150), { once: true }); setTimeout(light, 2500); }
  };

  /* Logo entrance: the head script adds .intro on the first Home visit of a session */
  const intro = $('.intro-screen');
  if (intro && doc.classList.contains('intro')) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      doc.classList.add('intro-out');
      setTimeout(() => {
        doc.classList.remove('intro', 'intro-out');
        intro.remove();
        lightHero();
      }, 900);
    };
    try { sessionStorage.setItem('bpb-intro', '1'); } catch (e) { /* storage blocked: the intro may replay */ }
    $('.intro-skip', intro).addEventListener('click', finish);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') finish(); }, { once: true });
    setTimeout(finish, 3100);
  } else {
    if (intro) intro.remove();
    lightHero();
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

  const naira = n => `₦${Math.round(n).toLocaleString('en-NG')}`;
  const hhmm = mins => {
    const m = ((Math.round(mins) % 1440) + 1440) % 1440;
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  };
  const span = mins => {
    const h = Math.floor(mins / 60), m = Math.round(mins % 60);
    return h ? `${h} h ${m} min` : `${m} min`;
  };

  /* Home hero: a lamp glow follows the cursor (desktop pointers only, see CSS) */
  if (hero && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    let raf = 0, x = 0, y = 0;
    hero.addEventListener('pointerenter', () => hero.classList.add('is-lit-by-cursor'));
    hero.addEventListener('pointerleave', () => hero.classList.remove('is-lit-by-cursor'));
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        hero.style.setProperty('--mx', `${x}px`);
        hero.style.setProperty('--my', `${y}px`);
      });
    });
  }

  /* Right now in Benin City: West Africa Time and today's sun, from the NOAA solar equations */
  const nowBox = $('.now');
  if (nowBox) {
    const LAT = 6.335, LNG = 5.627, WAT = 60; // Benin City; UTC+1, no daylight saving
    const rad = Math.PI / 180;
    const sunTimes = date => {
      const start = Date.UTC(date.getUTCFullYear(), 0, 0);
      const doy = Math.floor((date - start) / 864e5);
      const g = 2 * Math.PI / 365 * (doy - 1);
      const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
      const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
      const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl)) / rad;
      return { rise: 720 - 4 * (LNG + ha) - eq + WAT, set: 720 - 4 * (LNG - ha) - eq + WAT };
    };
    const els = { time: $('#now-time'), status: $('#now-status'), rise: $('#now-rise'), set: $('#now-set'), left: $('#now-left'), bar: $('#now-bar') };
    let watNow = 0;
    const tick = () => {
      const d = new Date();
      watNow = (d.getUTCHours() * 60 + d.getUTCMinutes() + WAT) % 1440;
      const { rise, set } = sunTimes(d);
      const up = watNow >= rise && watNow < set;
      els.time.textContent = hhmm(watNow);
      els.time.setAttribute('datetime', hhmm(watNow));
      els.rise.textContent = hhmm(rise);
      els.set.textContent = hhmm(set);
      els.left.textContent = up ? span(set - watNow) : 'none until sunrise';
      els.status.innerHTML = up
        ? '<span class="on">The sun is up.</span> Solar panels across the city are charging now.'
        : `The sun has set. Batteries are carrying the night. Sunrise in ${span((rise - watNow + 1440) % 1440)}.`;
      const frac = up ? (watNow - rise) / (set - rise) : (watNow < rise ? 0 : 1);
      els.bar.style.setProperty('--day', frac.toFixed(3));
      els.bar.classList.toggle('night', !up);
      els.bar.setAttribute('aria-label', up ? `Daylight is ${Math.round(frac * 100)}% through today` : 'It is night in Benin City');
    };
    tick();
    setInterval(tick, 30000);

    // Jump the 24-hour scroll scene to the current hour
    $('#now-jump').addEventListener('click', () => {
      const scene = $('#day');
      if (!scene) return;
      if (scene.classList.contains('static')) { scene.scrollIntoView(); return; }
      const p = (((watNow / 60) - 6 + 24) % 24) / 24;
      const top = scene.getBoundingClientRect().top + window.scrollY + p * (scene.offsetHeight - window.innerHeight);
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* What darkness costs: the visitor's own fuel and bill figures, added up */
  const spend = $('#spend-form');
  if (spend) {
    const val = name => Math.max(0, parseFloat(spend.elements[name].value) || 0);
    const out = { month: $('#s-month'), year: $('#s-year'), five: $('#s-five'), note: $('#s-note'), wa: $('#s-wa') };
    const update = () => {
      const litres = val('litres'), price = val('price'), bill = val('bill');
      const month = litres * price * 52 / 12 + bill;
      out.month.textContent = naira(month);
      out.year.textContent = naira(month * 12);
      out.five.textContent = naira(month * 60);
      out.note.textContent = month
        ? `That is ${naira(month * 12)} a year on fuel and bills, before generator repairs. Ask us what a system sized for your home costs.`
        : 'Type your own numbers above. Nothing you enter leaves this page unless you send it.';
      const msg = month
        ? `Hello Blessed Prince B, I spend about ${naira(month)} a month on generator fuel and electricity (${litres} litres of fuel a week). What would a solar system for my home cost?`
        : 'Hello Blessed Prince B, I want to know what a solar system for my home would cost.';
      out.wa.href = `https://wa.me/2347038895712?text=${encodeURIComponent(msg)}`;
    };
    spend.addEventListener('input', update);
    spend.addEventListener('submit', e => e.preventDefault());
    update();
  }

  /* Tubular vs lithium: drag, tap or use the arrow keys */
  $$('.compare').forEach(box => {
    const range = $('.compare-range', box);
    const set = () => box.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', set);
    set();
  });
})();
