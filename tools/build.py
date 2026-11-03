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
<meta property="og:url" content="https://moneybee.world{path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MoneyBee">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://moneybee.world{path}">
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
pages = []
for f in sorted((root / 'tools/pages').glob('*.html')):
    lines = f.read_text().split('\n', 3)
    path, title, desc, body = lines[0].strip(), lines[1].strip(), lines[2].strip(), lines[3]
    out = HEAD.format(title=title, desc=desc, path=path) + header + '\n<main id="main">\n' + body + '\n</main>\n' + footer + '\n' + cookie + '\n<script src="/cookie.js" defer></script>\n<script src="/site.js" defer></script>\n</body>\n</html>\n'
    dest = root / (path.strip('/') + '/index.html' if path.endswith('/') else path.lstrip('/'))
    dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(out); pages.append(path)
    print('built', dest.relative_to(root))
urls = ['/'] + [p for p in pages if p != '/404.html']
(root / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>https://moneybee.world{u}</loc><lastmod>2026-11-03</lastmod></url>\n' for u in urls) + '</urlset>\n')
