# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: owners and finance leads of merchants in the UAE (restaurants and cafes, retail, e-commerce, travel and airlines, marketplaces and creators) choosing a payment provider. They arrive from a WhatsApp share, LinkedIn or a referral, usually on a phone, and decide in a few minutes whether to book a demo or message on WhatsApp.
Secondary (confirmed): banks and PSPs evaluating the white-label Payment OS; developers reading the API, SDK and sandbox story.

## Product Purpose
MoneyBee is the Payment OS: one place to accept, route, settle, issue and reconcile money. The site exists to earn a demo request or a WhatsApp conversation, and to let a visitor see the real product (app, checkout, console) rather than read about it. Success is a booked demo from a UAE merchant, bank or PSP.

## Positioning
One ledger across accept, route, settle, issue and reconcile. Every module writes to the same double-entry ledger, so a payment, its fee, its payout, its dispute and its reconciliation are one record, and 120+ connectors sit behind one API and one contract.

## Operating Context
Launch market is the Middle East and North Africa; the United Arab Emirates is live first. Dubai is home. First UAE acquirers are being integrated (card acquiring via hosted fields, plus a local wallet); do not name acquirers on the site until the user confirms.
Site: static HTML/CSS/JS on Netlify (moneybee.world) with an Arabic mirror at /ar/. Subpages are built from tools/pages via tools/build.py which injects the header and footer from index.html. Home-page animation lives in main.js; inner pages use site.js.

## Capabilities and Constraints
Modules shown: Accept, Orchestrate, Risk, Ledger, Settle, Payouts, Issue cards (with ekka), Crypto, FX, Billing, Disputes, Reconcile (with SoleAI), Onboard (agentic KYB), AML. Products: MoneyBee Lite app (iOS and Android, English and Arabic), checkout, payment links and QR, invoices, orchestration console, white-label console, Substrate ERP.
Figures that may be stated: 120+ connectors, 24 modules on one ledger, 99.99% availability target, API response ceiling 100 ms, 215 TPS per 8/32 server. Compliance: PCI DSS v4.0 readiness (not certification), token vault, WAF/DDoS, IDS/IPS, OWASP Top 10, AWS/Azure/on-prem.
Constraints: no em dashes anywhere (hyphens only); claims must be honest about what is live versus in integration; no acquirer or partner names beyond SoleAI, ekka, Substrate, Orki and Fracxn without confirmation; the legal footer (Neon Global FZ-LLC, RAKEZ) stays.
Undecided: pricing is not published; customer logos and testimonials do not exist yet and must not be invented.

## Brand Commitments
Name: MoneyBee, wordmark "moneybee" with "bee" in gold. Mark: a hexagon with three horizontal bars. Fixed by the user: the cream, ink and honey palette, Inter Tight (Plex Arabic for /ar/), and the hexagon mark. Voice: plain, confident, short sentences; product shown, not described; payments vocabulary used correctly (acquirer, settlement, reconciliation, 3DS).
Companies in the hive: SoleAI (reconciliation and reporting), ekka (Visa cards from crypto or bank), Substrate (AI ERP for SMEs), Orki (stablecoin account for global earners), Fracxn (lending, embedded finance, tokenised assets).

## Evidence on Hand
Real product screenshots in assets/img (app-today, app-newlink, app-onboard, app-payments, pay-page, console-dashboard, console-routing, console-recon, console-merchants). A 30-second product reel at assets/video/MoneyBee_PaymentOS_Reel.mp4 with poster. Contact: pt@moneybee.world and +971 55 861 2001. No customer logos, testimonials, press or case studies exist; do not fabricate them.

## Product Principles
- Show the product moving money; every section should carry one real screen or one working interaction.
- Honest numbers and honest status: live, in integration, or target, never blurred.
- Local first: UAE and MENA methods, currencies and names lead; global follows.
- One voice: single-colour headings, short leads, no labels above headings.
- The phone comes first: every section must read on a 390px screen before it is tuned for desktop.

## Accessibility & Inclusion
Arabic right-to-left mirror must stay at parity with English. Motion respects prefers-reduced-motion and the on-page "Pause motion" control. Text contrast at or above 4.5:1 on cream and on dark panels.
