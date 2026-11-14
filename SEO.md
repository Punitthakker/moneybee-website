# SEO and indexing for moneybee.world

What the site does on its own (14 Nov 2026):
- Every page: title, description, canonical, Open Graph and X card tags (`twitter:site` @MoneybeeWorld), 1200x630 share image.
- English and Arabic pairs (home, company, products) linked both ways with hreflang, in the pages and in `sitemap.xml`.
- `sitemap.xml` lists every indexable page in both languages with the date each last changed; `python3 tools/build.py` regenerates it.
- Structured data (JSON-LD) on both home pages: Organization (Neon Global FZ-LLC, LinkedIn, X) and WebSite only. No product or app entry until the apps are in the stores and live payment methods are confirmed, so the data never claims more than is available.
- `robots.txt` allows the site and points to the sitemap; the 404 and thank-you pages carry noindex; build sources, repo notes and editor files answer 404 (netlify.toml).
- IndexNow key file at the site root (`fd33fa9e377a9ef6699ec32ae370b6d8.txt`) so Bing and other IndexNow engines can be told about new pages at once.

What needs Punit (one time, about 15 minutes, after this is deployed):
1. Google Search Console: https://search.google.com/search-console, Add property, choose "Domain", enter `moneybee.world`, and add the TXT record it shows at the DNS host (GoDaddy). This covers www, http and https.
2. In Search Console: Sitemaps, submit `https://moneybee.world/sitemap.xml`. Then URL inspection, paste `https://moneybee.world/` and `https://moneybee.world/ar/`, Request indexing.
3. Bing Webmaster Tools: https://www.bing.com/webmasters, Import from Google Search Console (one click once step 1 is done). Bing also feeds ChatGPT search and Copilot.
4. Tell IndexNow about the pages (any time a page is added):
   `curl "https://api.indexnow.org/indexnow?url=https://moneybee.world/&key=fd33fa9e377a9ef6699ec32ae370b6d8"`
5. Check the share previews LinkedIn and X will show: https://www.linkedin.com/post-inspector/ with `https://moneybee.world/`.

Posting on LinkedIn and X helps indexing only through links: put the moneybee.world page (not just the brand name) in posts, the company pages' website field and both bios. Google usually picks up a new site within days of the sitemap being submitted; ranking for "payment gateway UAE" style searches needs pages written for those searches (see the content plan Claude proposed on 14 Nov).
