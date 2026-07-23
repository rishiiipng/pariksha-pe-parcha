# 🪳 pariksha pe parcha
### *less humanity than a chatbot*

A Gen-Z satire site roasting the Government of India's handling of the **2026 NEET-UG paper-leak
scandal** and the ongoing Jantar Mantar protests. Harsh jokes, **real cited facts**, and a joke
petition to make Claude the PM of India.

## Run it
Plain static site — **no build step, no dependencies, no env vars**.
- Quick look: **double-click `index.html`**.
- Full experience (embeds + live counter need `http(s)`): run
  `python -m http.server 8123` and open `http://localhost:8123`.

## Pages
| file | what |
|------|------|
| `index.html` | hero, animated stat counters, 30-sec TL;DR |
| `timeline.html` | "the receipts" — tap-to-expand timeline (May→July), each node links a real source |
| `crimes.html` | "hall of shame" — the worst of it + real protest photos + govt-vs-AI scoreboard |
| `claude-pm.html` | satirical manifesto + the joke petition |
| `css/style.css` | shared theme (mobile-first) |
| `js/main.js` | nav, count-up, **dynamic day counters** (`data-since`), scroll-reveal, 🪳 easter egg |
| `js/petition.js` | **live, server-synced** petition counter (see below) |

Design is a **neo-brutalist pop** theme (chunky pressable buttons, hard offset shadows, highlighter accents).

## The petition (live & server-synced)
The "Claude for PM" counter is a **real shared tally** — everyone who clicks increments the same global
number, synced to a public counter service ([abacus](https://abacus.jasoncameron.dev),
namespace `parikshapeparcha`, key `claude-for-pm-india-2026`). It stores **only an integer** — no names,
emails, or personal data, ever. It appears on both the homepage and `claude-pm.html` (same count).
- If the service is unreachable it falls back to the last-seen count and shows a notice.
- To **reset it to zero**, change `KEY` in `js/petition.js` to a fresh string.
- To use your own backend instead, swap the `GET`/`HIT` URLs in `js/petition.js`.

## Real footage
`timeline.html` embeds playable **YouTube videos from independent journalists** (Unfiltered by Samdish).
Swap/add clips by editing the `.embed-grid` iframes (use `youtube-nocookie.com/embed/<VIDEO_ID>`).

## Ground rules baked in
- **Every hard fact links to a real source.** Sources: [2026 NEET controversy](https://en.wikipedia.org/wiki/2026_NEET_controversy),
  [2026 Delhi Jantar Mantar protests](https://en.wikipedia.org/wiki/2026_Delhi_Jantar_Mantar_protests),
  plus linked news reports.
- **No fabricated or unlicensed images.** All photographs are **real** and **freely licensed**
  (CC0 / CC BY-SA 4.0) via Wikimedia Commons, each credited inline in its caption *and* in the footer.
  No AI-generated illustrations, no scraped news photos. All images are `loading="lazy"` with
  descriptive `alt` text and explicit dimensions.
- **The petition** stores only a count — no personal data.
- Persistent **satire disclaimer** + a contact email (`Deyayush599@gmail.com`) in every footer.

## Share as Instagram story
The petition's **"share as IG story"** button renders a 1080×1920 PNG with a random anti-govt roast
quote (10 in the rotation, edit `QUOTES` in `js/petition.js`). On a phone it opens the native share
sheet (post straight to your IG story); on desktop it downloads the PNG.

## Credits
Photographs via [Wikimedia Commons](https://commons.wikimedia.org/), used under their licences:

| image | author | licence |
|-------|--------|---------|
| [Protestors at Jantar Mantar](https://commons.wikimedia.org/wiki/File:Protestors_at_Jantar_Mantar.jpg) | Cockroach Janta Party | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| [CJP Protestors holding Bhagat Singh posters](https://commons.wikimedia.org/wiki/File:CJP_Protestors_holding_Bhagat_Singh_posters.jpg) | Pelph Hoters | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| [Sonam Wangchuk taken to hospital](https://commons.wikimedia.org/wiki/File:Sonam_Wangchuk_taken_to_hospital.webp) | Pelph Hoters | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |

Video reporting: [Unfiltered by Samdish](https://www.youtube.com/@UNFILTEREDbySamdish) (embedded from
YouTube). Day-25 reel: Sonam Wangchuk via Instagram (embedded). All media belongs to its creators.

## Analytics
Vercel **Web Analytics** + **Speed Insights** (both free on Hobby), loaded from the same-origin
`/_vercel/…` paths in each page's `<head>`. They only return data on a Vercel deployment —
locally those paths 404, which is expected.

**They must each be switched on in the Vercel dashboard** (Project → Analytics → Enable, and
Project → Speed Insights → Enable), otherwise the scripts load but nothing is recorded.

> CSP note: `connect-src` **must** keep `'self'` — the scripts beacon to `/_vercel/insights/view`
> and `/_vercel/speed-insights/vitals` on the same origin. Dropping `'self'` silently kills all
> analytics while leaving the page looking fine.

## Self-check
Open `claude-pm.html?selftest` and check the console for `petition self-check passed ✅`.
