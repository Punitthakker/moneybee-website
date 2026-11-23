"""Builds inner pages from tools/pages/*.html using the header and footer from index.html.
Each page file starts with three lines: path, title, description. Run: python3 tools/build.py"""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
home = (root / 'index.html').read_text()
header = home[home.index('<!-- HEADER START -->'):home.index('<!-- HEADER END -->') + len('<!-- HEADER END -->')]
footer = home[home.index('<!-- FOOTER START -->'):home.index('<!-- FOOTER END -->') + len('<!-- FOOTER END -->')]
cookie = home[home.index('<div class="cookie"'):home.index('</div>', home.index('<div class="cookie"')) + 6]

HEAD = '''<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cut">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#F4EFE4">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://moneybee.world/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://moneybee.world{path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MoneyBee">
<meta property="og:locale" content="en_AE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@MoneybeeWorld">
{index}
<link rel="icon" href="/assets/img/favicon.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/InterTight-500Medium.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<script>
  try {{ var t = localStorage.getItem('mb-theme'); if (t) document.documentElement.dataset.theme = t; else if (matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.dataset.theme = 'dark'; }} catch (e) {{}}
  document.documentElement.classList.add('js');
</script>
</head>
<body class="inner">
<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"><span></span></div>
'''
# Pages that also exist in Arabic under /ar (hand-made). Keep in step with ar/.
ARABIC = {'/company/', '/products/'}

def index_tags(path):
    if path == '/404.html':
        return '<meta name="robots" content="noindex">'
    tags = [f'<link rel="canonical" href="https://moneybee.world{path}">']
    if path in ARABIC:
        tags += [f'<link rel="alternate" hreflang="en" href="https://moneybee.world{path}">',
                 f'<link rel="alternate" hreflang="ar" href="https://moneybee.world/ar{path}">',
                 f'<link rel="alternate" hreflang="x-default" href="https://moneybee.world{path}">']
    return '\n'.join(tags)

pages = []
for f in sorted((root / 'tools/pages').glob('*.html')):
    lines = f.read_text().split('\n', 3)
    path, title, desc, body = lines[0].strip(), lines[1].strip(), lines[2].strip(), lines[3]
    out = HEAD.format(title=title, desc=desc, path=path, index=index_tags(path)) + header + '\n<main id="main">\n' + body + '\n</main>\n' + footer + '\n' + cookie + '\n<script src="/cookie.js" defer></script>\n<script src="/site.js" defer></script>\n</body>\n</html>\n'
    dest = root / (path.strip('/') + '/index.html' if path.endswith('/') else path.lstrip('/'))
    dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(out); pages.append(path)
    print('built', dest.relative_to(root))
# MoneyBee Lite search pages (tools/lite/*.html, same three-line header). The Lite home is its own Netlify project;
# these pages use its stylesheet and look, and netlify.toml serves them from here ahead of the /lite/* proxy.
LITE_STYLE = """<style>
.sub-top { padding-top: clamp(120px, 14vh, 170px); }
.sub .lede { margin-top: 28px; }
.sub .d3 { margin-bottom: 8px; }
.sub .facts + .d3, .sub .spec + .d3 { margin-top: clamp(50px, 6vw, 90px); }
.sub .facts dt a { text-decoration: underline; text-underline-offset: 3px; }
.duo { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); gap: clamp(30px, 6vw, 100px); align-items: start; }
.duo .phone { width: min(300px, 80%); justify-self: center; }
.shots { display: grid; grid-template-columns: repeat(3, minmax(0, 220px)); gap: clamp(16px, 3vw, 40px); margin-top: clamp(30px, 4vw, 50px); }
.shots figcaption { margin-top: 12px; font-size: 15.5px; color: var(--mute); text-align: center; }
.sub .facts > div { grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); }
.sub .spec { max-width: 52em; }
.sub .acts { margin-top: 32px; }
.sub .next .body > div { max-width: 46em; }
@media (max-width: 1000px) { .duo { grid-template-columns: minmax(0, 1fr); } .shots { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 560px) { .shots { grid-template-columns: minmax(0, 240px); justify-content: center; } }
</style>"""
LITE_STYLE_AR = """<style>
@font-face { font-family: "Plex Arabic"; src: url(/assets/fonts/PlexArabic-400.woff2) format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Plex Arabic"; src: url(/assets/fonts/PlexArabic-600.woff2) format("woff2"); font-weight: 600 700; font-display: swap; }
[dir="rtl"] body, [dir="rtl"] .d2, [dir="rtl"] .d3, [dir="rtl"] .sheet a.big, [dir="rtl"] .steps li::before { font-family: "Plex Arabic", "Inter Tight", system-ui, sans-serif; font-stretch: 100%; letter-spacing: 0; }
[dir="rtl"] .d2 { line-height: 1.2; font-size: clamp(38px, 5.4vw, 88px); }
[dir="rtl"] .d3 { line-height: 1.25; }
[dir="rtl"] .when { transform: rotate(4deg); transform-origin: 100% 0; }
@media (min-width: 1001px) { [dir="rtl"] .scene { padding-left: var(--pad); padding-right: 0; } [dir="rtl"] .when { padding-left: 0; padding-right: var(--pad); } }
</style>"""
# Light or dark (same key as the Lite home), the menu, and the header background once scrolled. No other script.
LITE_SCRIPT = """<script>
(function () {
  var d = document.documentElement, b = document.querySelector('.burger'), s = document.getElementById('sheet'), h = document.querySelector('.hd');
  document.querySelector('.mode').addEventListener('click', function () { var t = d.dataset.theme === 'dark' ? 'light' : 'dark'; d.dataset.theme = t; try { localStorage.setItem('mb-lite-look', t); } catch (e) {} });
  function menu(o) { b.setAttribute('aria-expanded', String(o)); b.setAttribute('aria-label', o ? b.dataset.close : b.dataset.open); s.classList.toggle('open', o); d.classList.toggle('menu-open', o); d.style.overflow = o ? 'hidden' : ''; }
  b.addEventListener('click', function () { menu(b.getAttribute('aria-expanded') !== 'true'); });
  s.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });
  function stuck() { h.classList.toggle('stuck', scrollY > 30); } addEventListener('scroll', stuck, { passive: true }); stuck();
})();
</script>"""
lite_src = sorted((root / 'tools/lite').glob('*.html'))
lite_paths = [f.read_text().split('\n', 1)[0].strip() for f in lite_src]
LITE_AR = {p[3:] for p in lite_paths if p.startswith('/ar/')}  # English paths that have an Arabic twin
lite_pages = []
for f in lite_src:
    path, title, desc, body = [x.strip() if i < 3 else x for i, x in enumerate(f.read_text().split('\n', 3))]
    ar = path.startswith('/ar/')
    en = path[3:] if ar else path
    alt = ''
    if en in LITE_AR:
        alt = (f'<link rel="alternate" hreflang="en" href="https://moneybee.world{en}">\n'
               f'<link rel="alternate" hreflang="ar" href="https://moneybee.world/ar{en}">\n'
               f'<link rel="alternate" hreflang="x-default" href="https://moneybee.world{en}">\n')
    shell = (root / ('tools/lite-shell.ar.html' if ar else 'tools/lite-shell.en.html')).read_text()
    out = (shell.replace('{{TITLE}}', title).replace('{{DESC}}', desc).replace('{{PATH}}', path).replace('{{ALT}}', alt)
           .replace('{{EN}}', en).replace('{{STYLE}}', LITE_STYLE + (LITE_STYLE_AR if ar else '')).replace('{{SCRIPT}}', LITE_SCRIPT)
           .replace('{{BODY}}', body).replace(f'<a href="{path}">', f'<a href="{path}" aria-current="page">'))
    assert '{{' not in out and '\u2014' not in out, f.name  # no unfilled token, no em dash
    dest = root / (path.strip('/') + '/index.html')
    dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(out); lite_pages.append(path)
    print('built', dest.relative_to(root))
# Sitemap: every indexable page in both languages, with hreflang pairs and the date the page last changed in git.
import subprocess, datetime
def lastmod(rel):
    if subprocess.run(['git', 'diff', '--quiet', 'HEAD', '--', rel], cwd=root).returncode != 0:
        return datetime.date.today().isoformat()  # changed and not committed yet
    if not (root / rel).exists():
        return None  # served by another project (the Lite home): no date we can vouch for
    out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', rel], cwd=root, capture_output=True, text=True).stdout.strip()
    return out or datetime.date.today().isoformat()
def file_of(u):
    return 'index.html' if u == '/' else u.strip('/') + '/index.html'
pairs = {'/': '/ar/', **{p: '/ar' + p for p in ARABIC | LITE_AR}}
urls = (['/'] + [p for p in pages if p != '/404.html'] + ['/ar/'] + ['/ar' + p for p in sorted(ARABIC)]
        + ['/lite/'] + [p for p in lite_pages if not p.startswith('/ar/')] + ['/ar' + p for p in sorted(LITE_AR)])
entries = []
for u in urls:
    en = u if not u.startswith('/ar/') else next((k for k, v in pairs.items() if v == u), None)
    alt = ''
    if en in pairs:
        alt = (f'    <xhtml:link rel="alternate" hreflang="en" href="https://moneybee.world{en}"/>\n'
               f'    <xhtml:link rel="alternate" hreflang="ar" href="https://moneybee.world{pairs[en]}"/>\n'
               f'    <xhtml:link rel="alternate" hreflang="x-default" href="https://moneybee.world{en}"/>\n')
    lm = lastmod(file_of(u))
    entries.append(f'  <url>\n    <loc>https://moneybee.world{u}</loc>\n' + (f'    <lastmod>{lm}</lastmod>\n' if lm else '') + f'{alt}  </url>\n')
(root / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + ''.join(entries) + '</urlset>\n')
