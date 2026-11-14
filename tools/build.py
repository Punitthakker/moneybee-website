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
# Sitemap: every indexable page in both languages, with hreflang pairs and the date the page last changed in git.
import subprocess, datetime
def lastmod(rel):
    if subprocess.run(['git', 'diff', '--quiet', 'HEAD', '--', rel], cwd=root).returncode != 0:
        return datetime.date.today().isoformat()  # changed and not committed yet
    out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', rel], cwd=root, capture_output=True, text=True).stdout.strip()
    return out or datetime.date.today().isoformat()
def file_of(u):
    return 'index.html' if u == '/' else u.strip('/') + '/index.html'
pairs = {'/': '/ar/', **{p: '/ar' + p for p in ARABIC}}
urls = ['/'] + [p for p in pages if p != '/404.html'] + ['/ar/'] + ['/ar' + p for p in sorted(ARABIC)]
entries = []
for u in urls:
    en = u if not u.startswith('/ar/') else next((k for k, v in pairs.items() if v == u), None)
    alt = ''
    if en in pairs:
        alt = (f'    <xhtml:link rel="alternate" hreflang="en" href="https://moneybee.world{en}"/>\n'
               f'    <xhtml:link rel="alternate" hreflang="ar" href="https://moneybee.world{pairs[en]}"/>\n'
               f'    <xhtml:link rel="alternate" hreflang="x-default" href="https://moneybee.world{en}"/>\n')
    entries.append(f'  <url>\n    <loc>https://moneybee.world{u}</loc>\n    <lastmod>{lastmod(file_of(u))}</lastmod>\n{alt}  </url>\n')
(root / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + ''.join(entries) + '</urlset>\n')
