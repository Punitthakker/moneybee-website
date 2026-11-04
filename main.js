// MoneyBee Payment OS site. Plain JS, no dependencies.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduce.matches;

  // ---------- strings for the Arabic site (/ar/). English is the key. ----------
  const AR = {
    'Rule: lowest cost': 'القاعدة: الأقل تكلفة', 'Rule: best success rate': 'القاعدة: أعلى نسبة نجاح', 'Rule: local currency': 'القاعدة: العملة المحلية', 'Rule: ticket size': 'القاعدة: حجم العملية', 'Rule: local method': 'القاعدة: وسيلة الدفع المحلية', 'Rule: crypto rail': 'القاعدة: مسار العملات الرقمية',
    'Soft decline: cascading': 'رفض مؤقت: إعادة التوجيه', 'Recovered and approved': 'تمت الاستعادة والموافقة', 'Approved': 'تمت الموافقة', 'Play motion': 'تشغيل الحركة', 'Pause motion': 'إيقاف الحركة',
    'Dubai': 'دبي', 'New York': 'نيويورك', 'Mumbai': 'مومباي', 'Riyadh': 'الرياض', 'Amsterdam': 'أمستردام', 'Tron network': 'شبكة ترون', 'London': 'لندن', 'Abu Dhabi': 'أبوظبي',
    'Matching': 'جارٍ المطابقة', 'Matched': 'مطابق', 'Review': 'مراجعة',
    'Explorer': 'المستكشف', 'Visit six sections': 'زُر ستة أقسام', 'Hive keeper': 'حارس الخلية', 'Tap six honeycomb cells': 'اضغط ست خلايا في قرص العسل', 'Router': 'الموجّه', 'Finish Beat the router': 'أكمل لعبة تحدّي الموجّه',
    'Developer': 'المطوّر', 'Switch the code language': 'بدّل لغة الكود', 'Film buff': 'عاشق الأفلام', 'Watch 10 seconds of the film': 'شاهد 10 ثوانٍ من الفيلم', 'Night bee': 'نحلة الليل', 'Try the other theme': 'جرّب المظهر الآخر',
    'Unlocked': 'مفتوح', 'Coin unlocked: ': 'فتحت عملة: ', ' honey · ': ' عسل · ', ' of 6 coins': ' من 6 عملات', 'Queen bee': 'ملكة النحل', 'You know MoneyBee better than most. Let’s talk?': 'تعرف MoneyBee أكثر من معظم الناس. نتحدث؟',
    'Acquirer UAE': 'بنك مستحوذ في الإمارات', 'Acquirer KSA': 'بنك مستحوذ في السعودية', 'Global acquirer': 'بنك مستحوذ عالمي', 'Acquirer EU': 'بنك مستحوذ في أوروبا', 'Acquirer US': 'بنك مستحوذ في أمريكا', 'Card acquirer': 'مستحوذ بطاقات', 'UPI rail': 'مسار UPI', 'Crypto rail': 'مسار العملات الرقمية',
    'Acquirer A': 'المستحوذ أ', 'Acquirer B': 'المستحوذ ب', 'Acquirer C': 'المستحوذ ج', 'Ethereum rail': 'شبكة إيثيريوم', 'Tron rail': 'شبكة ترون',
    '2.1% · no mada': '2.1% · لا يدعم مدى', '1.6% · 96% approved': '1.6% · قبول 96%', '2.9% · 91% approved': '2.9% · قبول 91%', '2.1% · 88% approved': '2.1% · قبول 88%', '2.4% · 93% approved': '2.4% · قبول 93%', '2.2% · 97% approved': '2.2% · قبول 97%',
    '2.5% · cards only': '2.5% · بطاقات فقط', '0.4% · 98% approved': '0.4% · قبول 98%', '1.0% · USDT only': '1.0% · USDT فقط', '2.0% · 81% today': '2.0% · قبول 81% اليوم', '2.4% · 96% today': '2.4% · قبول 96% اليوم', '2.2% · timing out': '2.2% · انتهاء مهلة',
    'network fee ~ $4': 'رسوم الشبكة ~ 4$', 'network fee ~ $1': 'رسوم الشبكة ~ 1$', 'cannot take USDT': 'لا يقبل USDT',
    'mada is a Saudi debit network. The KSA acquirer takes it, and it is also the cheapest.': 'مدى شبكة خصم سعودية. المستحوذ السعودي يقبلها، وهو الأقل تكلفة أيضاً.',
    'Local acquiring lifts approvals. A US card is approved more often by a US acquirer.': 'الاستحواذ المحلي يرفع نسبة القبول. البطاقة الأمريكية تُقبل أكثر لدى مستحوذ أمريكي.',
    'UPI is a bank rail in India. Cheapest and most approved, no card needed.': 'UPI مسار بنكي في الهند. الأرخص والأعلى قبولاً، دون حاجة لبطاقة.',
    'Cheapest is not always best. Acquirer A is declining today, so a declined sale costs more than 0.4%.': 'الأرخص ليس الأفضل دائماً. المستحوذ أ يرفض كثيراً اليوم، والعملية المرفوضة تكلّف أكثر من 0.4%.',
    'Same stablecoin, different network. Tron settles fast with a lower fee.': 'العملة المستقرة نفسها، لكن الشبكة مختلفة. ترون تسوّي بسرعة وبرسوم أقل.',
    'Round ': 'الجولة ', ' of ': ' من ', 'Which provider would you send this payment to?': 'إلى أي مزوّد سترسل هذه الدفعة؟', 'Same call as MoneyBee. ': 'القرار نفسه الذي اتخذته MoneyBee. ', 'Too slow. ': 'تأخرت. ', 'MoneyBee chose differently. ': 'اختارت MoneyBee خياراً مختلفاً. ',
    'Perfect. You routed like MoneyBee.': 'ممتاز. وجّهت الدفعات مثل MoneyBee.', 'You matched the router ': 'طابقت الموجّه ', ' of 5 times.': ' من 5 مرات.',
    'Play with sound': 'شغّل مع الصوت', 'Mute': 'كتم الصوت',
  };
  const t = (s) => (document.documentElement.lang === 'ar' && AR[s]) || s;


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
    $('[data-m]').textContent = TX[i][0]; $('[data-a]').textContent = TX[i][1]; $('[data-c]').textContent = t(TX[i][2]);
    srcs.forEach((s, k) => s.classList.toggle('on', k === SRC[i]));
    tx.classList.remove('swap');
    $('[data-rule]').textContent = t(RULES[i]);
    await travel(pIn, win, 900);
    core.classList.remove('hit'); void core.offsetWidth; core.classList.add('hit');
    const t0 = performance.now();
    if (fallback >= 0) {
      wires[first].classList.add('dead');
      await travel(pBad, wires[first], 700);
      provs[first].classList.add('fail');
      $('[data-rule]').textContent = t('Soft decline: cascading');
      await wait(350);
    }
    const win2 = fallback >= 0 ? fallback : first;
    wires[win2].classList.add('live');
    await travel(pOut, wires[win2], 800);
    provs[win2].classList.add('ok');
    $('[data-ms]').textContent = String(Math.round(140 + Math.random() * 80 + (fallback >= 0 ? 90 : 0)));
    $('[data-ok]').textContent = t(fallback >= 0 ? 'Recovered and approved' : 'Approved');
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
      $('[data-m]').textContent = TX[i][0]; $('[data-a]').textContent = TX[i][1]; $('[data-c]').textContent = t(TX[i][2]);
      srcs.forEach((s, k) => s.classList.toggle('on', k === SRC[i])); tx.classList.remove('swap');
      $('[data-rule]').textContent = t(RULES[i]); core.classList.remove('hit'); void core.offsetWidth; core.classList.add('hit');
      await wait(600);
      if (fallback >= 0) { provs[first].classList.add('fail'); $('[data-rule]').textContent = t('Soft decline: cascading'); await wait(600); }
      provs[fallback >= 0 ? fallback : first].classList.add('ok');
      $('[data-ok]').textContent = t(fallback >= 0 ? 'Recovered and approved' : 'Approved');
    }
    timer = setTimeout(mobileCycle, 2200);
  }
  const pauseBtn = $('.pause');
  if (reduce.matches) { pauseBtn.textContent = t('Play motion'); pauseBtn.setAttribute('aria-pressed', 'true'); }
  pauseBtn.addEventListener('click', () => {
    const wasFresh = reduce.matches && step === 0;
    paused = !paused;
    pauseBtn.textContent = t(paused ? 'Play motion' : 'Pause motion');
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
  if (steps) { if (!reduce.matches) steps.style.setProperty('--draw', 0); else items.forEach((li) => li.classList.add('lit')); }

  // ---------- six into one ----------
  const six = $('.six');
  if (six) new IntersectionObserver((es) => es.forEach((e) => six.classList.toggle('go', e.isIntersecting && e.intersectionRatio > 0.6)), { threshold: [0, 0.6, 1] }).observe(six);

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


  // ---------- honey silk: slow mesh of light behind the hero ----------
  const silk = $('.silk');
  if (silk) {
    const ctx = silk.getContext('2d'), W = 160, H = 90; silk.width = W; silk.height = H;
    const BL = [ // x, y, r, colour, speed
      [0.15, 0.2, 0.75, [240, 212, 154], 0.00011], [0.8, 0.1, 0.7, [217, 184, 120], 0.00009],
      [0.55, 0.65, 0.65, [252, 240, 214], 0.00013], [0.95, 0.7, 0.6, [196, 150, 64], 0.00008], [0.3, 0.9, 0.55, [244, 232, 205], 0.0001],
    ];
    let silkOn = true;
    const paint = (t) => {
      const dark = document.documentElement.dataset.theme === 'dark';
      ctx.fillStyle = dark ? '#0F0E0B' : '#F4EFE4'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
      BL.forEach(([x, y, r, c, sp], i) => {
        const cx = (x + Math.sin(t * sp + i * 1.7) * 0.18) * W, cy = (y + Math.cos(t * sp * 1.3 + i) * 0.22) * H, rr = r * W * 0.55;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        const a = dark ? 0.32 : 0.9;
        g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      ctx.globalCompositeOperation = 'source-over';
    };
    const loop = (t) => { if (silkOn && !paused) paint(t); requestAnimationFrame(loop); };
    paint(4000);
    if (!reduce.matches) requestAnimationFrame(loop);
    new IntersectionObserver((es) => (silkOn = es[0].isIntersecting)).observe(silk);
    new MutationObserver(() => paint(performance.now())).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // ---------- hero tag rotator ----------
  const rot = $$('[data-rot] b');
  if (rot.length) {
    let ri = 0; rot[0].classList.add('on');
    if (!reduce.matches) setInterval(() => {
      if (paused) return;
      const cur = rot[ri % rot.length], nxt = rot[++ri % rot.length];
      cur.classList.remove('on'); cur.classList.add('out'); setTimeout(() => cur.classList.remove('out'), 600);
      nxt.classList.add('on');
    }, 2600);
  }

  // ---------- globe: dotted sphere with corridors out of Dubai ----------
  const gc = $('.globe');
  if (gc) {
    const g = gc.getContext('2d'), S = gc.width, R = S * 0.42, C = S / 2;
    const pts = []; const N = 1400;
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const ll = (lat, lon) => { const a = lat * Math.PI / 180, b = lon * Math.PI / 180; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };
    const HUB = ll(25.2, 55.3);
    const CITIES = [[19.1, 72.9], [51.5, -0.1], [24.7, 46.7], [1.35, 103.8], [6.5, 3.4], [40.7, -74], [30.0, 31.2], [41.0, 29.0], [22.3, 114.2], [-1.3, 36.8], [48.9, 2.35], [-26.2, 28.0]].map(([a, b]) => ll(a, b));
    let rotY = -0.95, last = 0, gOn = false;
    const tagEls = [$('.t1'), $('.t2'), $('.t3')];
    const proj = ([x, y, z]) => { const c = Math.cos(rotY), s2 = Math.sin(rotY), X = x * c + z * s2, Z = -x * s2 + z * c, tilt = -0.32, Y = y * Math.cos(tilt) - Z * Math.sin(tilt), Z2 = y * Math.sin(tilt) + Z * Math.cos(tilt); return [C + X * R, C - Y * R, Z2]; };
    const slerp = (a, b, t) => { const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), s = Math.sin(d) || 1; const k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s, lift = 1 + Math.sin(Math.PI * t) * 0.18 * d; return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift]; };
    const draw = (t) => {
      const dark = document.documentElement.dataset.theme === 'dark';
      g.clearRect(0, 0, S, S);
      const halo = g.createRadialGradient(C, C, R * 0.6, C, C, R * 1.15); halo.addColorStop(0, 'rgba(217,184,120,0)'); halo.addColorStop(0.8, dark ? 'rgba(217,184,120,.10)' : 'rgba(217,184,120,.18)'); halo.addColorStop(1, 'rgba(217,184,120,0)');
      g.fillStyle = halo; g.beginPath(); g.arc(C, C, R * 1.15, 0, 7); g.fill();
      for (const p of pts) { const [x, y, z] = proj(p); if (z < -0.05) continue; g.fillStyle = dark ? `rgba(242,237,226,${0.12 + z * 0.4})` : `rgba(21,19,15,${0.1 + z * 0.32})`; g.fillRect(x - 1.2, y - 1.2, 2.4, 2.4); }
      CITIES.forEach((cty, i) => {
        const phase = ((t / 2600) + i / CITIES.length) % 1;
        g.beginPath(); let started = false;
        for (let k = 0; k <= 40; k++) { const q = proj(slerp(HUB, cty, k / 40)); if (q[2] < -0.1) { started = false; continue; } if (!started) { g.moveTo(q[0], q[1]); started = true; } else g.lineTo(q[0], q[1]); }
        g.strokeStyle = dark ? 'rgba(217,184,120,.35)' : 'rgba(184,134,11,.35)'; g.lineWidth = 1.4; g.stroke();
        const q = proj(slerp(HUB, cty, phase)); if (q[2] > -0.1) { g.fillStyle = '#F0B848'; g.beginPath(); g.arc(q[0], q[1], 3.2, 0, 7); g.fill(); }
        const e = proj(cty); if (e[2] > 0) { g.fillStyle = dark ? '#F3D79C' : '#8C6510'; g.beginPath(); g.arc(e[0], e[1], 3, 0, 7); g.fill(); }
      });
      // Pin the labels to their cities as the globe turns.
      const box = gc.getBoundingClientRect(), k = box.width / S;
      [[tagEls[0], HUB], [tagEls[1], CITIES[0]], [tagEls[2], CITIES[1]]].forEach(([el, pt]) => { if (!el) return; const q = proj(pt); el.style.transform = `translate(${q[0] * k + 10}px, ${q[1] * k - 14}px)`; el.style.opacity = q[2] > 0.15 ? 1 : 0; });
      const h = proj(HUB); if (h[2] > 0) { g.fillStyle = '#B8860B'; g.beginPath(); g.arc(h[0], h[1], 6 + Math.sin(t / 300) * 1.5, 0, 7); g.fill(); g.strokeStyle = 'rgba(184,134,11,.35)'; g.lineWidth = 6; g.stroke(); }
    };
    const gl = (t) => { if (gOn && !paused) { rotY += Math.min(50, t - last) * 0.00012; draw(t); } last = t; requestAnimationFrame(gl); };
    draw(0);
    if (!reduce.matches) { new IntersectionObserver((es) => (gOn = es[0].isIntersecting)).observe(gc); requestAnimationFrame(gl); }
    new MutationObserver(() => draw(performance.now())).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // ---------- code that types itself, then shows the real response ----------
  const CODE = {
    node: `<span class="k">import</span> { MoneyBeeClient } <span class="k">from</span> <span class="s">'@moneybee/sdk'</span>;

<span class="k">const</span> mb = <span class="k">new</span> <span class="f">MoneyBeeClient</span>({
  baseUrl: <span class="s">'https://api.moneybee.world'</span>,
  apiKey: process.env.<span class="n">MONEYBEE_KEY</span>,
});

<span class="k">const</span> pay = <span class="k">await</span> mb.payments.<span class="f">create</span>({
  amount: { minor: <span class="n">10000</span>, currency: <span class="s">'AED'</span> },
});  <span class="c">// routed, risk-checked, on the ledger</span>`,
    python: `<span class="k">from</span> moneybee <span class="k">import</span> MoneyBeeClient, Amount

mb = <span class="f">MoneyBeeClient</span>(<span class="s">"https://api.moneybee.world"</span>, key)

pay = mb.<span class="f">create_payment</span>(<span class="f">Amount</span>(<span class="n">10000</span>, <span class="s">"AED"</span>))
<span class="f">print</span>(pay[<span class="s">"status"</span>], pay[<span class="s">"fee"</span>][<span class="s">"minor"</span>])
<span class="c"># captured 290</span>`,
    curl: `curl https://api.moneybee.world/v1/payment_intents \\
  -H <span class="s">"authorization: Bearer $MONEYBEE_KEY"</span> \\
  -H <span class="s">"idempotency-key: order-1048"</span> \\
  -d <span class="s">'{"amount":{"minor":10000,"currency":"AED"}}'</span>`,
  };
  const RESP = `{
  "status": "captured",
  "amount": { "minor": 10000, "currency": "AED" },
  "fee": { "minor": 290, "currency": "AED" },
  "connector": "acquirer_uae", "route": "lowest_cost"
}`;
  const codeEl = $('[data-code] code'), respBox = $('[data-resp]'), ctabs = $$('.ctabs button');
  let typeJob = 0, codeSeen = false;
  const typeCode = (lang) => {
    const job = ++typeJob, html = CODE[lang];
    ctabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.l === lang)));
    respBox.classList.remove('on'); $('pre code', respBox).textContent = '';
    if (reduce.matches) { codeEl.innerHTML = html; $('pre code', respBox).textContent = RESP; respBox.classList.add('on'); return; }
    // Type the visible characters while keeping the colouring tags intact.
    const parts = html.split(/(<[^>]+>)/); let out = '', pi = 0, ci = 0;
    const step = () => {
      if (job !== typeJob) return;
      let n = 3;
      while (n > 0 && pi < parts.length) {
        const part = parts[pi];
        if (part.startsWith('<')) { out += part; pi++; continue; }
        if (ci < part.length) { out += part[ci++]; n--; } else { pi++; ci = 0; }
      }
      codeEl.innerHTML = out + '<span class="caret"></span>';
      if (pi < parts.length) setTimeout(step, 16);
      else setTimeout(() => { if (job !== typeJob) return; codeEl.innerHTML = out; $('pre code', respBox).textContent = RESP; respBox.classList.add('on'); }, 350);
    };
    step();
  };
  ctabs.forEach((b) => b.addEventListener('click', () => typeCode(b.dataset.l)));
  const codeBox = $('.code');
  if (codeBox) new IntersectionObserver((es) => { if (es[0].isIntersecting && !codeSeen) { codeSeen = true; typeCode('node'); } }, { threshold: 0.4 }).observe(codeBox);

  // ---------- reconciliation rows match one by one ----------
  const rows = $$('.ledger .lr:not(.head)');
  if (rows.length) {
    const final = rows.map((r) => $('.st', r));
    const runRecon = () => {
      final.forEach((st) => { st.className = 'st'; st.textContent = t('Matching'); });
      rows.forEach((r, i) => setTimeout(() => {
        r.classList.remove('scan'); void r.offsetWidth; r.classList.add('scan');
        setTimeout(() => { const st = final[i]; st.textContent = t(st.dataset.st === 'ok' ? 'Matched' : 'Review'); st.classList.add(st.dataset.st); }, 520);
      }, 300 + i * 650));
    };
    if (reduce.matches) final.forEach((st) => st.classList.add(st.dataset.st));
    else { final.forEach((st) => st.classList.add(st.dataset.st)); new IntersectionObserver((es) => { if (es[0].isIntersecting) runRecon(); }, { threshold: 0.5 }).observe($('.ledger')); }
  }


  // =====================================================================
  // Gamification: earn honey by exploring, unlock six coins, crown a Queen bee.
  // =====================================================================
  const HEXPTS = '13,2 23,7.5 23,18.5 13,24 3,18.5 3,7.5';
  const COINS = [
    ['explorer', 'Explorer', 'Visit six sections'], ['hive', 'Hive keeper', 'Tap six honeycomb cells'], ['router', 'Router', 'Finish Beat the router'],
    ['dev', 'Developer', 'Switch the code language'], ['film', 'Film buff', 'Watch 10 seconds of the film'], ['night', 'Night bee', 'Try the other theme'],
  ];
  let hive = { honey: 0, coins: [], seen: [], cells: [] };
  try { const raw = localStorage.getItem('mb-hive'); if (raw) hive = Object.assign(hive, JSON.parse(raw)); } catch (e) {}
  const save = () => { try { localStorage.setItem('mb-hive', JSON.stringify(hive)); } catch (e) {} };
  const hud = $('[data-hud]'), honeyEl = $('[data-honey]'), coinsEl = $('[data-coins]'), list = $('[data-coinlist]'), toastEl = $('[data-toast]');
  const pill = $('.hud-pill'), panel = $('#hud-panel');
  const renderHud = () => {
    honeyEl.textContent = hive.honey; coinsEl.textContent = `${hive.coins.length}/6`;
    list.innerHTML = COINS.map(([id, name, how]) => `<li class="${hive.coins.includes(id) ? 'got' : ''}"><svg viewBox="0 0 26 26"><polygon points="${HEXPTS}"/></svg>${t(name)}<small>${hive.coins.includes(id) ? t('Unlocked') : t(how)}</small></li>`).join('');
  };
  pill.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; pill.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', (e) => { if (!hud.contains(e.target)) { panel.hidden = true; pill.setAttribute('aria-expanded', 'false'); } });

  // A honey drop flies from where you earned it into the counter.
  const fly = (from) => {
    if (reduce.matches || !from) return;
    const a = from.getBoundingClientRect(), b = pill.getBoundingClientRect();
    if (!a.width) return;
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('span'); d.className = 'drop'; document.body.appendChild(d);
      const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + 18, y1 = b.top + b.height / 2;
      const mx = (x0 + x1) / 2 + (Math.random() - .5) * 200, my = Math.min(y0, y1) - 120 - Math.random() * 80;
      d.animate([{ transform: `translate(${x0}px,${y0}px) scale(.4)`, opacity: 0 }, { transform: `translate(${mx}px,${my}px) scale(1.1)`, opacity: 1, offset: .45 }, { transform: `translate(${x1}px,${y1}px) scale(.5)`, opacity: .9 }],
        { duration: 900 + i * 90, delay: i * 70, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => d.remove();
    }
  };
  let toastT = 0;
  const toast = (title, sub) => {
    toastEl.innerHTML = `<svg viewBox="0 0 26 26"><polygon points="${HEXPTS}"/></svg><div><b>${title}</b><span>${sub}</span></div>`;
    toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 3400);
  };
  const earn = (n, from) => {
    hive.honey += n; save(); fly(from);
    setTimeout(() => { renderHud(); hud.classList.remove('bump'); void hud.offsetWidth; hud.classList.add('bump'); }, reduce.matches ? 0 : 850);
  };
  const unlock = (id, from) => {
    if (hive.coins.includes(id)) return;
    hive.coins.push(id); const c = COINS.find((x) => x[0] === id);
    earn(20, from); toast(t('Coin unlocked: ') + t(c[1]), '+20' + t(' honey · ') + hive.coins.length + t(' of 6 coins'));
    if (hive.coins.length === 6) setTimeout(() => { toast(t('Queen bee'), t('You know MoneyBee better than most. Let’s talk?')); burst(innerWidth / 2, innerHeight / 2, 160); }, 1800);
    else burst((from || pill).getBoundingClientRect().left + 20, (from || pill).getBoundingClientRect().top + 20, 40);
  };

  // Hex confetti
  const cf = $('.confetti'), cctx = cf.getContext('2d'); let parts = [], cfRaf = 0;
  const burst = (x, y, n) => {
    if (reduce.matches) return;
    cf.width = innerWidth * devicePixelRatio; cf.height = innerHeight * devicePixelRatio; cctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, r: 4 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 1, c: ['#D9B878', '#F3D79C', '#B8860B', '#15130F'][i % 4] }); }
    cancelAnimationFrame(cfRaf);
    const step = () => {
      cctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter((p) => p.life > 0);
      parts.forEach((p) => { p.vy += .32; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .012; cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot); cctx.globalAlpha = Math.max(0, p.life); cctx.fillStyle = p.c; cctx.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; cctx.lineTo(Math.cos(a) * p.r, Math.sin(a) * p.r); } cctx.fill(); cctx.restore(); });
      if (parts.length) cfRaf = requestAnimationFrame(step); else cctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    cfRaf = requestAnimationFrame(step);
  };

  // Earning rules
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; const id = e.target.id; if (hive.seen.includes(id)) return;
    hive.seen.push(id); earn(10, $('h2', e.target) || e.target);
    if (hive.seen.length >= 6) unlock('explorer', $('h2', e.target));
  }), { threshold: 0.35 });
  $$('section[id]').forEach((sec) => secIO.observe(sec));
  cells.forEach((c, i) => c.addEventListener('click', () => {
    const k = c.querySelector('b').textContent; if (hive.cells.includes(k)) return;
    hive.cells.push(k); earn(5, c); if (hive.cells.length >= 6) unlock('hive', c);
  }));
  ctabs.forEach((b) => b.addEventListener('click', () => { if (b.dataset.l !== 'node') unlock('dev', b); }));
  $('.theme').addEventListener('click', (e) => unlock('night', e.currentTarget));
  renderHud();

  // =====================================================================
  // Beat the router: five payments, six seconds each.
  // =====================================================================
  const ROUNDS = [
    { m: 'mada', a: 'SAR 310.00', c: 'Riyadh', o: [['Acquirer UAE', '2.1% · no mada'], ['Acquirer KSA', '1.6% · 96% approved'], ['Global acquirer', '2.9% · 91% approved']], best: 1, why: 'mada is a Saudi debit network. The KSA acquirer takes it, and it is also the cheapest.' },
    { m: 'Visa', a: 'USD 89.90', c: 'New York', o: [['Acquirer UAE', '2.1% · 88% approved'], ['Acquirer EU', '2.4% · 93% approved'], ['Acquirer US', '2.2% · 97% approved']], best: 2, why: 'Local acquiring lifts approvals. A US card is approved more often by a US acquirer.' },
    { m: 'UPI', a: 'INR 4,500.00', c: 'Mumbai', o: [['Card acquirer', '2.5% · cards only'], ['UPI rail', '0.4% · 98% approved'], ['Crypto rail', '1.0% · USDT only']], best: 1, why: 'UPI is a bank rail in India. Cheapest and most approved, no card needed.' },
    { m: 'Apple Pay', a: 'AED 1,240.00', c: 'Dubai', o: [['Acquirer A', '2.0% · 81% today'], ['Acquirer B', '2.4% · 96% today'], ['Acquirer C', '2.2% · timing out']], best: 1, why: 'Cheapest is not always best. Acquirer A is declining today, so a declined sale costs more than 0.4%.' },
    { m: 'USDT', a: 'USDT 2,000.00', c: 'Tron network', o: [['Ethereum rail', 'network fee ~ $4'], ['Tron rail', 'network fee ~ $1'], ['Card acquirer', 'cannot take USDT']], best: 1, why: 'Same stablecoin, different network. Tron settles fast with a lower fee.' },
  ];
  const arena = $('[data-game]');
  if (arena) {
    const optsEl = $('[data-opts]', arena), why = $('[data-why]', arena), timerEl = $('[data-timer]', arena), startBtn = $('[data-start]', arena), endEl = $('[data-end]', arena), payEl = $('[data-pay]', arena);
    let r = 0, you = 0, mb = 0, tStart = 0, tRaf = 0, locked = true;
    const LIMIT = matchMedia('(pointer: coarse)').matches ? 10000 : 8000;
    arena.classList.add('idle');
    const drawRound = () => {
      const R0 = ROUNDS[r]; locked = false;
      payEl.classList.add('swap');
      setTimeout(() => { $('[data-gm]').textContent = R0.m; $('[data-ga]').textContent = R0.a; $('[data-gc]').textContent = t(R0.c); payEl.classList.remove('swap'); }, 220);
      $('[data-round]').textContent = t('Round ') + (r + 1) + t(' of ') + ROUNDS.length;
      optsEl.innerHTML = R0.o.map(([n, d], i) => `<button class="g-opt" type="button" data-i="${i}"><span class="mb-pick">MoneyBee</span><b>${t(n)}</b><span>${t(d)}</span></button>`).join('');
      why.textContent = t('Which provider would you send this payment to?');
      $$('.g-opt', optsEl).forEach((b) => b.addEventListener('click', () => pickOpt(+b.dataset.i, b)));
      tStart = performance.now(); cancelAnimationFrame(tRaf);
      const tick = (now) => { if (locked) return; const k = 1 - (now - tStart) / LIMIT; timerEl.style.transform = `scaleX(${Math.max(0, k)})`; if (k <= 0) pickOpt(-1); else tRaf = requestAnimationFrame(tick); };
      tRaf = requestAnimationFrame(tick);
    };
    const pickOpt = (i, btn) => {
      if (locked) return; locked = true; cancelAnimationFrame(tRaf);
      const R0 = ROUNDS[r], bs = $$('.g-opt', optsEl);
      bs.forEach((b, k) => { b.disabled = true; if (k === R0.best) b.classList.add('best'); else if (k !== i) b.classList.add('off'); });
      mb++; $('[data-mb]').textContent = mb;
      if (i === R0.best) { you++; $('[data-you]').textContent = you; bs[i].classList.add('right'); why.textContent = t('Same call as MoneyBee. ') + t(R0.why); earn(10, bs[i]); }
      else { if (i >= 0) bs[i].classList.add('wrong'); why.textContent = t(i < 0 ? 'Too slow. ' : 'MoneyBee chose differently. ') + t(R0.why); }
      setTimeout(() => { r++; if (r < ROUNDS.length) drawRound(); else finish(); }, 2600);
    };
    const finish = () => {
      $('[data-endt]').textContent = you === 5 ? t('Perfect. You routed like MoneyBee.') : t('You matched the router ') + you + t(' of 5 times.');
      endEl.hidden = false; unlock('router', $('[data-endt]'));
    };
    const start = () => { arena.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' }); r = 0; you = 0; mb = 0; $('[data-you]').textContent = 0; $('[data-mb]').textContent = 0; endEl.hidden = true; startBtn.hidden = true; arena.classList.remove('idle'); drawRound(); };
    startBtn.addEventListener('click', start);
    $('[data-again]', arena).addEventListener('click', start);
    // idle preview of round one: tapping a tile also starts the game
    const R0 = ROUNDS[0]; optsEl.innerHTML = R0.o.map(([n, d]) => `<div class="g-opt" role="button" tabindex="0"><b>${t(n)}</b><span>${t(d)}</span></div>`).join('');
    $$('.g-opt', optsEl).forEach((t) => t.addEventListener('click', start));
    // keep the honey counter out of the way while the game is on screen
    new IntersectionObserver((es) => hud.classList.toggle('away', es[0].isIntersecting), { threshold: 0.25 }).observe(arena);
  }

  // =====================================================================
  // The film: plays muted when on screen, ring shows progress.
  // =====================================================================
  const film = $('[data-film]');
  if (film) {
    const ring = $('.film-ring'), soundBtn = $('[data-film-sound]');
    let watched = 0, lastT = 0;
    new IntersectionObserver((es) => { const on = es[0].isIntersecting; if (on && !reduce.matches) { film.preload = 'auto'; film.play().catch(() => {}); } else film.pause(); }, { threshold: 0.5 }).observe(film);
    film.addEventListener('timeupdate', () => {
      ring.style.setProperty('--p', (film.currentTime / (film.duration || 30)).toFixed(3));
      const dt = film.currentTime - lastT; if (dt > 0 && dt < 1) watched += dt; lastT = film.currentTime;
      if (watched > 10) unlock('film', film);
    });
    soundBtn.addEventListener('click', () => {
      film.muted = !film.muted; if (!film.muted) { film.currentTime = 0; film.play().catch(() => {}); }
      $('span', soundBtn).textContent = t(film.muted ? 'Play with sound' : 'Mute');
    });
  }

  // =====================================================================
  // Small physical touches: magnetic primary buttons, light that follows the cursor.
  // =====================================================================
  if (!reduce.matches && matchMedia('(pointer: fine)').matches) {
    $$('.btn.lg, .bar .btn.ink').forEach((b) => {
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`; });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });
    $$('.flow, .talk-card').forEach((el) => el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`); }));
  }


  // =====================================================================
  // Before and after: six tangled integrations vs one clean MoneyBee line.
  // =====================================================================
  const NSs = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NSs, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent.appendChild(e); return e; };
  const layoutDia = (dia) => {
    const svg = $('.dia-svg', dia), box = dia.getBoundingClientRect(); if (!box.width) return;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`); svg.innerHTML = '';
    const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, cx: r.left - box.left + r.width / 2, cy: r.top - box.top + r.height / 2 }; };
    const top = rel($('.nd.top', dia)), nodes = $$('.grid6 .nd', dia).map(rel);
    const paths = [];
    if (dia.dataset.dia === 'mess') {
      // Each provider gets its own route out of the business: overlapping elbows, some dashed.
      const W = box.width, pad = 14;
      nodes.forEach((n, i) => {
        const left = n.cx < W / 2, sx = top.cx + (i - 2.5) * 16, laneY = top.b + 16 + (i % 3) * 14;
        const outerX = left ? pad + (i % 3) * 12 : W - pad - (i % 3) * 12;
        const ex = left ? n.l - 4 : n.r + 4;
        const d = `M${sx} ${top.b} V${laneY} H${outerX} V${n.cy} H${ex}`;
        paths.push(mk('path', { d, class: 'wire' + (i % 2 ? ' dash' : '') }, svg));
        mk('path', { d: left ? `M${ex - 8} ${n.cy - 5} L${ex} ${n.cy} L${ex - 8} ${n.cy + 5}` : `M${ex + 8} ${n.cy - 5} L${ex} ${n.cy} L${ex + 8} ${n.cy + 5}`, class: 'arrow' }, svg);
      });
    } else {
      const hub = rel($('.nd.hub', dia)), busY = hub.b + (nodes[0].t - hub.b) / 2;
      paths.push(mk('path', { d: `M${top.cx} ${top.b} V${hub.t - 4}`, class: 'wire solid' }, svg));
      mk('path', { d: `M${top.cx - 6} ${hub.t - 10} L${top.cx} ${hub.t - 3} L${top.cx + 6} ${hub.t - 10}`, class: 'arrow ink' }, svg);
      const xs = [...new Set(nodes.map((n) => Math.round(n.cx)))];
      mk('path', { d: `M${hub.cx} ${hub.b} V${busY} M${Math.min(...xs)} ${busY} H${Math.max(...xs)}`, class: 'wire solid' }, svg);
      nodes.forEach((n) => {
        // reach each row down the column gutter so lines never cross a box
        const d = n.t - nodes[0].t < 4 ? `M${hub.cx} ${hub.b} V${busY} H${n.cx} V${n.t - 3}` : `M${hub.cx} ${hub.b} V${busY} H${n.cx < hub.cx ? n.l - 12 : n.r + 12} V${n.cy} H${n.cx < hub.cx ? n.l - 3 : n.r + 3}`;
        paths.push(mk('path', { d, class: 'wire solid faint' }, svg));
      });
      mk('rect', { x: hub.cx - 6, y: busY - 6, width: 12, height: 12, transform: `rotate(45 ${hub.cx} ${busY})`, class: 'joint' }, svg);
    }
    // Travelling dots
    dia._dots = paths.map((p, i) => ({ p, len: p.getTotalLength(), dot: mk('circle', { r: 4.5, class: 'pkt' }, svg), off: i / paths.length }));
  };
  const dias = $$('[data-dia]');
  const layoutAll = () => dias.forEach(layoutDia);
  layoutAll(); addEventListener('resize', layoutAll); document.fonts && document.fonts.ready.then(layoutAll);
  let diaOn = false;
  dias.forEach((d) => new IntersectionObserver((es) => { d._on = es[0].isIntersecting; }, { threshold: 0.2 }).observe(d));
  const diaTick = (t) => {
    dias.forEach((d) => {
      if (!d._on || !d._dots || paused) return;
      const slow = d.dataset.dia === 'mess';
      d._dots.forEach(({ p, len, dot, off }, i) => {
        const k = ((t / (slow ? 3600 : 2200)) + off) % 1;
        const q = p.getPointAtLength(len * k); dot.setAttribute('cx', q.x); dot.setAttribute('cy', q.y);
        dot.setAttribute('opacity', slow && i % 3 === 1 && k > .6 ? 0 : Math.sin(k * Math.PI));
      });
    });
    requestAnimationFrame(diaTick);
  };
  if (!reduce.matches) requestAnimationFrame(diaTick);

  onScroll();
})();

// ---------- book a demo: submit in place, fall back to a normal POST ----------
(() => {
  const f = document.querySelector('[data-demo]'); if (!f || !window.fetch) return;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!f.reportValidity()) return;
    f.classList.add('sending');
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() });
      if (!r.ok) throw new Error(r.status);
      f.classList.remove('sending'); f.classList.add('done');
      const done = f.querySelector('.f-done'); done.hidden = false; done.focus && done.focus();
    } catch (err) { f.classList.remove('sending'); f.submit(); }
  });
})();
