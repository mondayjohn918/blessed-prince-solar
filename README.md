# Blessed Prince B. Solar System website

Five static pages (Home, Services, Projects, About, Contact) for the solar dealer and installer at 79 Akpakpava Road, opposite Union Bank, Benin City.

## Editing
- Edit the pages in `src/`, then rebuild: `py tools/build.py`. The header, footer, icons and the 24-hour dial are added by the build script, so change them in `tools/build.py`.
- Styles: `css/styles.css`. Behaviour (hero light, 24-hour dial, gallery, size guide): `js/site.js`.
- Photos: `originals/` holds the Google Business photos. Small ones were upscaled once with Real-ESRGAN x4plus into `originals/x4/` (not committed). `py tools/images.py` rebuilds `img/` and `og.jpg`.
- Preview: the `blessed-prince-site` entry in the workspace `.claude/launch.json` (port 5183).

## Brand
Colours come from the shop signboard: plum `#3A1D3F` / night `#1E0F24`, violet `#5446B0`, red `#D7332A` (24/7 Light), BPB green `#1E7B3C`, with lamp gold `#FFD27A` for light only. Type: Gambetta (display) and Satoshi (text), both from Fontshare (ITF Free Font Licence). The site loads them from `fonts/`; the full families are in `Documents/fonts/fontshare`. To install them on a PC for flyers and mock-ups, download them from Fontshare:
- Gambetta: https://www.fontshare.com/fonts/gambetta
- Satoshi: https://www.fontshare.com/fonts/satoshi

## Confirm with the client before launch
- Which number is on WhatsApp (the site uses 0703 889 5712).
- Opening hours (Google only says "closes 7 pm").
- "Since 2019" (based on the earliest Facebook post) and that Prince Chibueze Bishop Odenigbo is the founder.
- Facebook page link, an email address, and whether they install outside Benin City.
- The size guide uses rough rules (220Ah tubular, 550 W panels, 4.5 sun hours); adjust to the brands they stock.

## Interactive features
- Home: lamp glow that follows the cursor over the hero (desktop), "Right now in Benin City" (live West Africa Time, today's sunrise and sunset from the NOAA solar equations, button that jumps the 24-hour dial to now), and a fuel-and-bill calculator that adds up the visitor's own figures and sends them on WhatsApp.
- Services: drag slider comparing a tubular battery install with a lithium one (two real install photos).
- Add `?nointro` to the Home link to skip the logo entrance.
