"""Assemble the five pages from src/ by dropping in the shared header and footer.

Run:  py tools/build.py   (writes index.html, services.html, ... at the site root)
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

PAGES = {
    "index.html": "Home",
    "services.html": "Services",
    "projects.html": "Projects",
    "about.html": "About",
    "contact.html": "Contact",
}

ICONS = {
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    "whatsapp": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.9 17.8L.2 24l6.4-1.7A11.8 11.8 0 0 0 24 12c0-3.2-1.2-6.1-3.6-8.4z"/></svg>',
    "chev": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-width="1.6"/><path d="m8 12 3 3 5-6"/></svg>',
    "menu": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    "broom": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/></svg>',
    "clock": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    "wrench": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L2 10l8-8z"/></svg>',
    "tag": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/></svg>',
}

BADGE = ('<svg class="brand-badge" viewBox="0 0 100 100" aria-hidden="true">'
         '<path d="M14 26h72a14 14 0 0 1 14 14v46a14 14 0 0 1-14 14H14A14 14 0 0 1 0 86V40a14 14 0 0 1 14-14z" fill="#fff" stroke="#3A1D3F" stroke-width="4"/>'
         '<path d="M30 26a20 20 0 0 1 40 0z" fill="#D7332A"/>'
         '<g stroke="#D7332A" stroke-width="5" stroke-linecap="round"><path d="M50 2v8M25 11l5 6M75 11l-5 6"/></g>'
         '<text x="50" y="76" text-anchor="middle" font-family="\'Schibsted Grotesk\',Arial,sans-serif" font-weight="900" font-size="32" letter-spacing="-1" fill="#1E7B3C">BPB</text></svg>')

BRAND = ('<a class="brand" href="index.html" aria-label="Blessed Prince B. Solar System, home">' + BADGE +
         '<span class="brand-name"><b>Blessed Prince B.</b><span>Solar System <i>24/7 Light</i></span></span></a>')


def header(current: str) -> str:
    cur = ' aria-current="page"'
    links = "".join(
        f'<a href="{href}"{cur if href == current else ""}>{label}</a>'
        for href, label in PAGES.items()
    )
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="site-header over-dark">
  <div class="wrap header-in">
    {BRAND}
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">{ICONS['menu']}Menu</button>
    <nav class="nav" id="site-nav" aria-label="Main">
      {links}
      <a class="btn btn-red header-cta" href="contact.html#quote">Get a free quote</a>
    </nav>
  </div>
</header>"""


FOOTER = f"""<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        {BRAND}
        <p class="foot-motto">God is Able.</p>
        <p>&ldquo;And God said, Let there be light: and there was light.&rdquo; Genesis 1:3, the verse on our signboard.</p>
      </div>
      <div>
        <h3>Visit the shop</h3>
        <ul>
          <li>79 Akpakpava Road</li>
          <li>Opposite Union Bank</li>
          <li>Avbiama, Benin City, Edo State</li>
          <li><a href="https://maps.google.com/?q=Blessed+Prince+B+Solar+System+79+Akpakpava+Road+Benin+City">Get directions</a></li>
        </ul>
      </div>
      <div>
        <h3>Call or WhatsApp</h3>
        <ul>
          <li><a href="tel:+2347038895712">0703 889 5712</a></li>
          <li><a href="tel:+2348039421514">0803 942 1514</a></li>
          <li><a href="https://wa.me/2347038895712">WhatsApp us</a></li>
          <li>Shop closes at 7&nbsp;pm</li>
        </ul>
      </div>
      <div>
        <h3>Pages</h3>
        <ul>
          {"".join(f'<li><a href="{h}">{l}</a></li>' for h, l in PAGES.items())}
          <li><a href="https://www.instagram.com/bishop_odenigbo/">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-base">
      <span>&copy; <span data-year>2026</span> Blessed Prince B. Solar System (Prince Bishop Enterprises). We install and sell.</span>
      <span>Website by Mondprince Graphics</span>
    </div>
  </div>
</footer>
<nav class="m-bar" aria-label="Quick contact">
  <a href="tel:+2347038895712">{ICONS['phone']}Call</a>
  <a class="wa" href="https://wa.me/2347038895712?text=Hello%20Blessed%20Prince%20B%2C%20I%20want%20to%20ask%20about%20solar.">{ICONS['whatsapp']}WhatsApp</a>
</nav>
<script src="js/site.js" defer></script>"""


def dial() -> str:
    """24-hour dial for the home page. Noon at the top, midnight at the bottom."""
    import math
    ticks = []
    for h in range(24):
        a = math.radians((h - 12) / 24 * 360)
        major = h % 6 == 0
        r1, r2 = (182, 198) if major else (187, 195)
        x1, y1 = 200 + r1 * math.sin(a), 200 - r1 * math.cos(a)
        x2, y2 = 200 + r2 * math.sin(a), 200 - r2 * math.cos(a)
        ticks.append(f'<line class="tick{" major" if major else ""}" x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}"/>')
    nums = "".join(
        f'<text class="num" x="{x}" y="{y}" text-anchor="middle">{t}</text>'
        for t, x, y in (("12:00", 200, 74), ("18:00", 322, 205), ("00:00", 200, 338), ("06:00", 78, 205))
    )
    return f"""<svg class="dial" viewBox="0 0 400 400" role="img" aria-labelledby="dial-title">
  <title id="dial-title">A 24-hour clock showing when the panels charge and when the batteries take over</title>
  <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(237,230,241,.12)" stroke-width="12"/>
  <circle id="arc-sun" class="arc-sun" cx="200" cy="200" r="170" fill="none" stroke-width="12" stroke-linecap="round" transform="rotate(180 200 200)" stroke-dasharray="0 1100"/>
  <circle id="arc-batt" class="arc-batt" cx="200" cy="200" r="170" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="0 1100"/>
  {"".join(ticks)}
  {nums}
  <text id="dial-read" class="dial-read" x="200" y="222" text-anchor="middle">06:00</text>
  <text id="dial-sub" class="dial-sub" x="200" y="252" text-anchor="middle">Panels waking up</text>
  <g id="dial-hand" transform="rotate(-90 200 200)">
    <circle cx="200" cy="30" r="22" fill="rgba(255,210,122,.25)"/>
    <circle cx="200" cy="30" r="11" fill="#FFD27A"/>
  </g>
</svg>"""


def build():
    for name in PAGES:
        html = (SRC / name).read_text(encoding="utf-8")
        html = html.replace("{{header}}", header(name)).replace("{{footer}}", FOOTER).replace("{{dial}}", dial())
        for key, svg in ICONS.items():
            html = html.replace("{{icon:" + key + "}}", svg)
        (ROOT / name).write_text(html, encoding="utf-8")
        print("built", name)


if __name__ == "__main__":
    build()
