# Blessed Prince B. Solar System website

Five static pages (Home, Services, Projects, About, Contact) for the solar dealer and installer at 79 Akpakpava Road, opposite Union Bank, Benin City.

## Editing
- Edit the pages in `src/`, then rebuild: `py tools/build.py`. The header, footer, icons and badge are added by the build script, so change them in `tools/build.py`.
- Styles: `css/styles.css`. Behaviour (intro, shutter, accordion, quote bar, gallery, size guide): `js/site.js`.
- Photos: `originals/` holds the Google Business photos. Small ones were upscaled once with Real-ESRGAN x4plus into `originals/x4/` (not committed). `py tools/images.py` rebuilds `img/` and `og.jpg`.
- Preview: the `blessed-prince-site` entry in the workspace `.claude/launch.json` (port 5183).

## Brand and design
Direction "Loud and flat" (Taste skill, seed 1803972993): the 24/7 LIGHT signboard over 79 Akpakpava Road, set as a street poster.
- Colours from the sign, each section one flat field: red `#D2302A`, plum `#3A1D3F`, BPB green `#1E7B3C`, ink `#140A12`, white; sun yellow `#FFD249` is kept for buttons.
- One typeface: Cabinet Grotesk (Fontshare, ITF Free Font Licence), self-hosted in `fonts/`. The full family is in `Documents/fonts/fontshare/Cabinet Grotesk`.
- Logo entrance plays once per visit on Home (skip button, off for reduced motion). Add `?nointro` to the Home link to skip it, for example when sharing.
- Page sources are in `src/`; `py tools/build.py` adds the shared header, footer and icons.

## Confirm with the client before launch
- Which number is on WhatsApp (the site uses 0703 889 5712).
- Opening hours (Google only says "closes 7 pm").
- That Prince Chibueze Bishop Odenigbo is the founder (from Facebook; the About page says so).
- Facebook page link, an email address, and whether they install outside Benin City.
- The size guide uses rough rules (220Ah tubular, 550 W panels, 4.5 sun hours); adjust to the brands they stock.
