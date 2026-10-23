"""Assemble the five pages from src/ by dropping in the shared header, footer, icons and logo.

Run:  py tools/build.py   (writes index.html, services.html, ... at the site root)
"""
import hashlib
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
    "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "menu": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    "star": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
}

# The BPB badge from the shop signboard: white plate, green letters, the red sun rising over it.
BADGE = ('<svg class="badge" viewBox="0 0 100 100" aria-hidden="true">'
         '<path d="M14 26h72a14 14 0 0 1 14 14v46a14 14 0 0 1-14 14H14A14 14 0 0 1 0 86V40a14 14 0 0 1 14-14z" fill="#fff"/>'
         '<path d="M30 26a20 20 0 0 1 40 0z" fill="#D2302A"/>'
         '<g stroke="#D2302A" stroke-width="5" stroke-linecap="round"><path d="M50 2v8M25 11l5 6M75 11l-5 6"/></g>'
         '<text x="50" y="77" text-anchor="middle" font-family="\'Cabinet Grotesk\',Arial,sans-serif" font-weight="900" font-size="33" letter-spacing="-1" fill="#1E7B3C">BPB</text></svg>')

BRAND = ('<a class="brand" href="index.html" aria-label="Blessed Prince B. Solar System, home">' + BADGE +
         '<span class="brand-name">blessed prince b.</span></a>')


def header(current: str) -> str:
    cur = ' aria-current="page"'
    links = "".join(
        f'<a href="{href}"{cur if href == current else ""}>{label.lower()}</a>'
        for href, label in PAGES.items() if href != "index.html"
    )
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  {BRAND}
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">{ICONS['menu']}<span>menu</span></button>
  <nav class="nav" id="site-nav" aria-label="Main">
    {links}
    <a class="btn btn-sun nav-cta" href="contact.html#quote">get a quote</a>
  </nav>
</header>"""


FOOTER = f"""<footer class="site-footer">
  <div class="foot-top">
    <div class="foot-invite">
      <p class="foot-line">let there be light.</p>
      <p class="foot-verse">Genesis 1:3, painted on our signboard at 79 Akpakpava Road. Our motto: God is Able.</p>
      <a class="btn btn-sun" href="tel:+2347038895712">{ICONS['phone']}call 0703 889 5712</a>
    </div>
    <ul class="foot-links">
      <li><a href="https://wa.me/2347038895712">WhatsApp us</a></li>
      <li><a href="tel:+2348039421514">0803 942 1514</a></li>
      <li><a href="https://maps.google.com/?q=Blessed+Prince+B+Solar+System+79+Akpakpava+Road+Benin+City">79 Akpakpava Road, opposite Union Bank</a></li>
      <li><a href="https://www.instagram.com/bishop_odenigbo/">Instagram</a></li>
    </ul>
  </div>
  <div class="foot-legal">
    <span>&copy; <span data-year>2026</span> Blessed Prince B. Solar System (Prince Bishop Enterprises), Benin City</span>
    <span>Website by Mondprince Graphics</span>
  </div>
  <p class="foot-name" aria-hidden="true">blessed prince b.</p>
</footer>
<nav class="m-bar" aria-label="Quick contact">
  <a href="tel:+2347038895712">{ICONS['phone']}call</a>
  <a class="wa" href="https://wa.me/2347038895712?text=Hello%20Blessed%20Prince%20B%2C%20I%20want%20to%20ask%20about%20solar.">{ICONS['whatsapp']}WhatsApp</a>
</nav>
<script src="js/site.js" defer></script>"""


def build():
    for name in PAGES:
        html = (SRC / name).read_text(encoding="utf-8")
        html = (html.replace("{{header}}", header(name))
                    .replace("{{footer}}", FOOTER)
                    .replace("{{badge}}", BADGE))
        for key, svg in ICONS.items():
            html = html.replace("{{icon:" + key + "}}", svg)
        # Version the CSS and JS so browsers never pair a new page with an old cached file
        for asset in ("css/styles.css", "js/site.js"):
            v = hashlib.md5((ROOT / asset).read_bytes()).hexdigest()[:8]
            html = html.replace(f'"{asset}"', f'"{asset}?v={v}"')
        (ROOT / name).write_text(html, encoding="utf-8")
        print("built", name)


if __name__ == "__main__":
    build()
