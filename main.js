// MoneyBee Payment OS site. Plain JS, no dependencies.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduce.matches;

  // ---------- theme ----------
  $('.theme').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { document.documentElement.dataset.theme = next; try { localStorage.setItem('mb-theme', next); } catch (e) {} };
    if (document.startViewTransition && !reduce.matches) document.startViewTransition(apply); else apply();
  });

  // ---------- mobile menu ----------
  const menu = $('.menu'), sheet = $('#sheet');
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', open); sheet.hidden = !open; });
  $$('#sheet a').forEach((a) => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); sheet.hidden = true; }));

  // ---------- scroll progress + header ----------
  const prog = $('.progress span'), bar = $('.bar');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    bar.classList.toggle('small-bar', scrollY > 40);
    drawSteps();
  };
  addEventListener('scroll', onScroll, { passive: true });

  // ---------- reveal on enter ----------
  // Observe the heading's parent: a fully clipped element reports no intersection.
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target._rv.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -15% 0px' });
  $$('.reveal').forEach((el) => { const host = el.parentElement; host._rv = el; io.observe(host); });

  // ---------- HERO: a payment finds its route ----------
  const TX = [
    ['Apple Pay', 'AED 1,240.00', 'Dubai'], ['Visa', 'USD 89.90', 'New York'], ['UPI', 'INR 4,500.00', 'Mumbai'],
    ['mada', 'SAR 310.00', 'Riyadh'], ['iDEAL', 'EUR 64.00', 'Amsterdam'], ['USDT', 'USDT 2,000.00', 'Tron network'],
    ['Google Pay', 'GBP 42.50', 'London'], ['Tabby', 'AED 899.00', 'Abu Dhabi'],
  ];
  const RULES = ['Rule: lowest cost', 'Rule: best success rate', 'Rule: local currency', 'Rule: ticket size', 'Rule: local method', 'Rule: crypto rail', 'Rule: lowest cost', 'Rule: best success rate'];
  // [provider for first try, failover provider or -1]
  const ROUTE = [[0, -1], [1, -1], [2, -1], [0, 2], [1, -1], [3, -1], [1, 0], [2, -1]];
  const SRC = [0, 1, 2, 3, 1, 4, 0, 1];
  const wires = ['w-a', 'w-b', 'w-c', 'w-d'].map((id) => document.getElementById(id));
  const win = document.getElementById('w-in');
  const pIn = $('#p-in'), pOut = $('#p-out'), pBad = $('#p-bad');
  const provs = $$('.prov'), srcs = $$('.src li'), core = $('.core');
  const tx = $('[data-tx]');
  let step = 0, timer = 0;

  // Draw the wires from the real positions of the card, the core and each provider.
  const flowEl = $('.flow'), svgW = $('.wires'), hexEl = $('.hexcore');
  const layoutWires = () => {
    const f = flowEl.getBoundingClientRect(); if (!f.width) return;
    svgW.setAttribute('viewBox', `0 0 ${f.width} ${f.height}`);
    const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - f.left, r: r.right - f.left, y: r.top - f.top + r.height / 2 }; };
    const t = rel(tx), h = rel(hexEl);
    win.setAttribute('d', `M${t.r + 6} ${t.y} C ${(t.r + h.l) / 2} ${t.y}, ${(t.r + h.l) / 2} ${h.y}, ${h.l + 8} ${h.y}`);
    provs.forEach((pv, k) => { const q = rel(pv), mx = (h.r + q.l) / 2;
      wires[k].setAttribute('d', `M${h.r - 8} ${h.y} C ${mx} ${h.y}, ${mx} ${q.y}, ${q.l - 4} ${q.y}`); });
  };
  layoutWires(); addEventListener('resize', layoutWires); document.fonts && document.fonts.ready.then(layoutWires);

  const travel = (dot, path, ms) => new Promise((done) => {
    const len = path.getTotalLength(), svg = path.ownerSVGElement, t0 = performance.now();
    dot.style.opacity = 1;
    const frame = (now) => {
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      const pt = path.getPointAtLength(len * e);
      dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      if (k < 1) requestAnimationFrame(frame); else { dot.style.opacity = 0; done(); }
    };
    requestAnimationFrame(frame);
  });
  const wait = (ms) => new Promise((r) => (timer = setTimeout(r, ms)));

  const reset = () => { provs.forEach((p) => p.classList.remove('ok', 'fail')); wires.forEach((w) => w.classList.remove('live', 'dead')); };
  async function cycle() {
    if (paused || document.hidden) { timer = setTimeout(cycle, 600); return; }
    const i = step++ % TX.length, [first, fallback] = ROUTE[i];
    reset(); layoutWires();
    tx.classList.add('swap'); await wait(250);
    $('[data-m]').textContent = TX[i][0]; $('[data-a]').textContent = TX[i][1]; $('[data-c]').textContent = TX[i][2];
    srcs.forEach((s, k) => s.classList.toggle('on', k === SRC[i]));
    tx.classList.remove('swap');
    $('[data-rule]').textContent = RULES[i];
    await travel(pIn, win, 900);
    core.classList.remove('hit'); void core.offsetWidth; core.classList.add('hit');
    const t0 = performance.now();
    if (fallback >= 0) {
      wires[first].classList.add('dead');
      await travel(pBad, wires[first], 700);
      provs[first].classList.add('fail');
      $('[data-rule]').textContent = 'Soft decline: cascading';
      await wait(350);
    }
    const win2 = fallback >= 0 ? fallback : first;
    wires[win2].classList.add('live');
    await travel(pOut, wires[win2], 800);
    provs[win2].classList.add('ok');
    $('[data-ms]').textContent = String(Math.round(140 + Math.random() * 80 + (fallback >= 0 ? 90 : 0)));
    $('[data-ok]').textContent = fallback >= 0 ? 'Recovered and approved' : 'Approved';
    await wait(1700);
    cycle();
  }
  const heroVisible = () => matchMedia('(min-width: 981px)').matches;
  if (!reduce.matches) setTimeout(() => (heroVisible() ? cycle() : mobileCycle()), 1400);
  else { provs[0].classList.add('ok'); wires[0].classList.add('live'); }
  // On phones the wires are hidden: just step through providers.
  async function mobileCycle() {
    if (!paused && !document.hidden) {
      const i = step++ % TX.length, [first, fallback] = ROUTE[i];
      reset(); tx.classList.add('swap'); await wait(250);
      $('[data-m]').textContent = TX[i][0]; $('[data-a]').textContent = TX[i][1]; $('[data-c]').textContent = TX[i][2];
      srcs.forEach((s, k) => s.classList.toggle('on', k === SRC[i])); tx.classList.remove('swap');
      $('[data-rule]').textContent = RULES[i]; core.classList.remove('hit'); void core.offsetWidth; core.classList.add('hit');
      await wait(600);
      if (fallback >= 0) { provs[first].classList.add('fail'); $('[data-rule]').textContent = 'Soft decline: cascading'; await wait(600); }
      provs[fallback >= 0 ? fallback : first].classList.add('ok');
      $('[data-ok]').textContent = fallback >= 0 ? 'Recovered and approved' : 'Approved';
    }
    timer = setTimeout(mobileCycle, 2200);
  }
  const pauseBtn = $('.pause');
  if (reduce.matches) { pauseBtn.textContent = 'Play motion'; pauseBtn.setAttribute('aria-pressed', 'true'); }
  pauseBtn.addEventListener('click', () => {
    const wasFresh = reduce.matches && step === 0;
    paused = !paused;
    pauseBtn.textContent = paused ? 'Play motion' : 'Pause motion';
    pauseBtn.setAttribute('aria-pressed', String(paused));
    document.documentElement.classList.toggle('still', paused);
    if (wasFresh && !paused) (heroVisible() ? cycle : mobileCycle)();
  });

  // ---------- honeycomb: fills like a comb, then tells you what each cell does ----------
  const cells = $$('.cell'), note = $('[data-note]');
  const combIO = new IntersectionObserver((es) => {
    if (!es[0].isIntersecting) return;
    combIO.disconnect();
    if (reduce.matches) return;
    cells.forEach((c, i) => setTimeout(() => c.classList.add('fill'), 60 * i));
    setTimeout(() => cells.forEach((c, i) => setTimeout(() => c.classList.remove('fill'), 40 * i)), 60 * cells.length + 700);
  }, { threshold: 0.4 });
  combIO.observe($('.comb'));
  const pick = (c) => { cells.forEach((x) => x.classList.toggle('sel', x === c)); note.textContent = `${c.querySelector('b').textContent}: ${c.dataset.d}.`; note.classList.add('has'); };
  cells.forEach((c) => { c.addEventListener('click', () => pick(c)); c.addEventListener('mouseenter', () => pick(c)); c.addEventListener('focus', () => pick(c)); });

  // ---------- phones: gentle tilt toward the pointer ----------
  const phones = $('.phones');
  if (phones && !reduce.matches && matchMedia('(pointer: fine)').matches) {
    phones.addEventListener('pointermove', (e) => {
      const r = phones.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      $('.p2', phones).style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(30px)`;
      $('.p1', phones).style.transform = `rotate(-7deg) translateZ(-40px) translateX(${x * -14}px)`;
      $('.p3', phones).style.transform = `rotate(7deg) translateZ(-40px) translateX(${x * 14}px)`;
    });
    phones.addEventListener('pointerleave', () => $$('.phone', phones).forEach((p) => (p.style.transform = '')));
  }

  // ---------- console tabs: auto-advance with a progress line ----------
  const tabs = $$('.tabs button'), shots = $$('.screens img'), pbar = $('.bar-prog span'), rules = $$('.rules span');
  let tab = 0, tabT0 = 0, tabRaf = 0, consoleOn = false;
  const TAB_MS = 5200;
  const show = (n) => {
    tab = n; tabT0 = performance.now();
    tabs.forEach((b, k) => b.setAttribute('aria-selected', String(k === n)));
    shots.forEach((s, k) => s.classList.toggle('on', k === n));
  };
  tabs.forEach((b, k) => b.addEventListener('click', () => show(k)));
  let ruleI = 0, ruleT = 0;
  const tick = (now) => {
    if (!consoleOn) return;
    if (!paused) {
      const k = (now - tabT0) / TAB_MS;
      pbar.style.transform = `scaleX(${Math.min(1, k)})`;
      if (k >= 1) show((tab + 1) % tabs.length);
      if (now - ruleT > 900) { ruleT = now; rules.forEach((r, j) => r.classList.toggle('on', j === ruleI % rules.length)); ruleI++; }
    } else tabT0 = now - parseFloat(pbar.style.transform.replace(/[^\d.]/g, '') || 0) * TAB_MS;
    tabRaf = requestAnimationFrame(tick);
  };
  new IntersectionObserver((es) => {
    consoleOn = es[0].isIntersecting && !reduce.matches;
    if (consoleOn) { tabT0 = performance.now(); cancelAnimationFrame(tabRaf); tabRaf = requestAnimationFrame(tick); }
  }, { threshold: 0.3 }).observe($('.browser'));

  // ---------- integration line draws with scroll ----------
  const steps = $('.steps'), items = $$('.steps li');
  function drawSteps() {
    if (!steps || reduce.matches) return;
    const r = steps.getBoundingClientRect(), mid = innerHeight * 0.62;
    const k = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    steps.style.setProperty('--draw', k.toFixed(3));
    items.forEach((li) => li.classList.toggle('lit', li.getBoundingClientRect().top + 10 < mid));
  }
  if (!reduce.matches) steps.style.setProperty('--draw', 0);
  else items.forEach((li) => li.classList.add('lit'));

  // ---------- six into one ----------
  const six = $('.six');
  new IntersectionObserver((es) => es.forEach((e) => six.classList.toggle('go', e.isIntersecting && e.intersectionRatio > 0.6)), { threshold: [0, 0.6, 1] }).observe(six);

  // ---------- counters ----------
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce.matches) return;
    const t0 = performance.now(), ms = 1400;
    const f = (now) => { const k = Math.min(1, (now - t0) / ms), v = end * (1 - Math.pow(1 - k, 4)); el.textContent = pre + v.toFixed(dec) + suf; if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => cio.observe(el));

  // ---------- CTA honeycomb that lights up as you move ----------
  const tc = $('.talk-comb');
  if (tc) {
    const NS = 'http://www.w3.org/2000/svg', R = 26, W = R * Math.sqrt(3);
    for (let row = 0; row < 8; row++) for (let col = 0; col < 9; col++) {
      const cx = col * W + (row % 2 ? W / 2 : 0), cy = row * R * 1.5;
      const p = document.createElementNS(NS, 'polygon');
      p.setAttribute('points', [0, 1, 2, 3, 4, 5].map((k) => { const a = Math.PI / 180 * (60 * k - 90); return `${(cx + (R - 2) * Math.cos(a)).toFixed(1)},${(cy + (R - 2) * Math.sin(a)).toFixed(1)}`; }).join(' '));
      tc.appendChild(p);
    }
    const polys = $$('polygon', tc);
    let lightT = 0;
    const light = () => { if (!paused && !document.hidden) { const p = polys[Math.floor(Math.random() * polys.length)]; p.classList.add('lit'); setTimeout(() => p.classList.remove('lit'), 1600); } lightT = setTimeout(light, 260); };
    if (!reduce.matches) new IntersectionObserver((es) => { clearTimeout(lightT); if (es[0].isIntersecting) light(); }).observe(tc);
  }

  onScroll();
})();
