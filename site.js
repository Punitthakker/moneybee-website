// Shared behaviour for inner pages: theme, menu, progress, reveal, docs helpers.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  $('.theme').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { document.documentElement.dataset.theme = next; try { localStorage.setItem('mb-theme', next); } catch (e) {} };
    if (document.startViewTransition && !reduce.matches) document.startViewTransition(apply); else apply();
  });

  const menu = $('.menu'), sheet = $('#sheet');
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', open); sheet.hidden = !open; });
  $$('#sheet a').forEach((a) => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); sheet.hidden = true; }));

  const prog = $('.progress span'), bar = $('.bar');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    bar.classList.toggle('small-bar', scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target._rv.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach((el) => { const host = el.parentElement; host._rv = el; io.observe(host); });

  // Copy buttons on code blocks.
  $$('.doc pre').forEach((pre) => {
    const b = document.createElement('button'); b.className = 'copy-btn'; b.type = 'button'; b.textContent = 'Copy';
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(pre.querySelector('code').innerText); b.textContent = 'Copied'; } catch (e) { b.textContent = 'Select and copy'; }
      setTimeout(() => (b.textContent = 'Copy'), 1600);
    });
    pre.appendChild(b);
  });

  // Highlight the current docs section in the sidebar.
  const links = $$('.toc a[href^="#"]');
  if (links.length) {
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { links.forEach((a) => a.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); }
    }), { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
  }
})();
