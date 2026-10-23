"""Turn the Google Business photos in originals/ into web-ready WebP files and og.jpg."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "originals", ROOT / "img"
OUT.mkdir(exist_ok=True)

# Small originals were upscaled once with Real-ESRGAN x4plus into originals/x4/ (see README).
for f in sorted(SRC.glob("p*.jpg")):
    up = SRC / "x4" / f"{f.stem}.png"
    im = ImageOps.exif_transpose(Image.open(up if up.exists() else f)).convert("RGB")
    for w in (640, 1200):
        c = im.copy()
        if c.width > w:
            c = c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
        c.save(OUT / f"{f.stem}-{w}.webp", "WEBP", quality=80, method=6)

# og image: night street light on plum with the motto
og = Image.new("RGB", (1200, 630), (30, 15, 36))
lamp = Image.open(SRC / "p15.jpg").convert("RGB")
lamp = ImageOps.fit(lamp, (480, 630), centering=(0.6, 0.3))
og.paste(lamp, (720, 0))
d = ImageDraw.Draw(og)
try:
    big = ImageFont.truetype("georgiab.ttf", 64); small = ImageFont.truetype("arialbd.ttf", 28)
except OSError:
    big = small = ImageFont.load_default()
d.text((64, 170), "Let there be light.", font=big, fill=(255, 255, 255))
d.text((64, 260), "Blessed Prince B. Solar System", font=small, fill=(255, 210, 122))
d.text((64, 304), "Solar, inverters & batteries · Benin City", font=small, fill=(220, 210, 230))
d.text((64, 520), "0703 889 5712", font=small, fill=(255, 255, 255))
og.save(ROOT / "og.jpg", quality=86)
print("done", len(list(OUT.glob('*.webp'))))
