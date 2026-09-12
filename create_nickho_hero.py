import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

BASE_DIR = Path(__file__).resolve().parent
STATIC_IMG = BASE_DIR / 'static' / 'images'
MEDIA_DIR = BASE_DIR / 'media' / 'hero'

def create_nickho_style_hero():
    w, h = 1920, 1080
    img = Image.new('RGB', (w, h), (7, 7, 8))
    draw = ImageDraw.Draw(img)

    # 1. Warm amber / gold bokeh & circuit lighting in top-right & center (like the Red Bull / Porsche yellow car highlights)
    for r in range(400, 0, -20):
        alpha = int(45 * (1 - r / 400))
        # Warm golden yellow glow on the right
        draw.ellipse([w*0.65 - r*1.6, h*0.35 - r, w*0.65 + r*1.6, h*0.35 + r], outline=(230, 160, 20, alpha))
        draw.ellipse([w*0.80 - r*1.2, h*0.25 - r, w*0.80 + r*1.2, h*0.25 + r], outline=(255, 190, 30, alpha))
        # Deep Red Bull navy glow on the left
        draw.ellipse([w*0.30 - r*1.4, h*0.50 - r, w*0.30 + r*1.4, h*0.50 + r], outline=(10, 25, 60, alpha))

    # 2. Angular racing bodywork / car bonnet lines in background (yellow & carbon)
    # Yellow car bonnet swooshes on the right
    draw.polygon([(w*0.50, h*0.25), (w*0.95, h*0.15), (w*0.98, h*0.55), (w*0.58, h*0.65)], fill=(180, 120, 10))
    draw.polygon([(w*0.52, h*0.28), (w*0.92, h*0.19), (w*0.95, h*0.50), (w*0.60, h*0.60)], fill=(220, 165, 15))
    # Dark carbon accents on car
    draw.polygon([(w*0.65, h*0.45), (w*0.88, h*0.35), (w*0.90, h*0.48), (w*0.68, h*0.55)], fill=(18, 18, 20))

    # 3. Center Driver Silhouette (Helmet + Racing Suit)
    # Torso
    draw.polygon([(w*0.22, h), (w*0.32, h*0.48), (w*0.52, h*0.48), (w*0.62, h)], fill=(15, 15, 18))
    # Dark racing suit shoulders with Red Bull blue & yellow/red trim
    draw.polygon([(w*0.22, h), (w*0.28, h*0.65), (w*0.38, h*0.65), (w*0.35, h)], fill=(10, 22, 45))
    draw.polygon([(w*0.48, h), (w*0.45, h*0.65), (w*0.55, h*0.65), (w*0.62, h)], fill=(10, 22, 45))
    # Red Bull racing red accents
    draw.line([(w*0.28, h*0.65), (w*0.35, h)], fill=(225, 6, 0), width=10)
    draw.line([(w*0.55, h*0.65), (w*0.48, h)], fill=(225, 6, 0), width=10)

    # Helmet outline
    # Chin & visor
    draw.ellipse([w*0.33, h*0.20, w*0.49, h*0.50], fill=(22, 22, 26))
    # Helmet colors: Yellow / Blue / Red Bull lion crown
    draw.chord([w*0.33, h*0.20, w*0.49, h*0.45], start=160, end=380, fill=(215, 170, 25))
    draw.arc([w*0.33, h*0.20, w*0.49, h*0.45], start=160, end=380, fill=(12, 35, 80), width=12)
    # Dark tinted iridescent visor
    draw.polygon([(w*0.35, h*0.32), (w*0.47, h*0.32), (w*0.46, h*0.40), (w*0.36, h*0.40)], fill=(8, 12, 18))
    draw.line([(w*0.35, h*0.33), (w*0.47, h*0.33)], fill=(50, 180, 240), width=3)

    # 4. Cinematic Dark Vignettes for Left and Right contrast
    # High contrast gradients on left (0 to 450px) and right (1400 to 1920px) to make telemetry ultra sharp
    left_gradient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    lg_draw = ImageDraw.Draw(left_gradient)
    for x in range(550):
        alpha = int(220 * (1 - x / 550))
        lg_draw.line([(x, 0), (x, h)], fill=(4, 4, 5, alpha))
    for x in range(w - 550, w):
        alpha = int(200 * ((x - (w - 550)) / 550))
        lg_draw.line([(x, 0), (x, h)], fill=(4, 4, 5, alpha))
    # Bottom vignette for name and countdown
    for y in range(h - 320, h):
        alpha = int(240 * ((y - (h - 320)) / 320))
        lg_draw.line([(0, y), (w, y)], fill=(4, 4, 5, alpha))

    img.paste(left_gradient, (0, 0), left_gradient)

    path1 = STATIC_IMG / 'mv_hero_reference.jpg'
    path2 = STATIC_IMG / 'mv_hero.jpg'
    img.save(path1, 'JPEG', quality=95)
    img.save(path2, 'JPEG', quality=95)
    if MEDIA_DIR.exists():
        img.save(MEDIA_DIR / 'mv_hero.jpg', 'JPEG', quality=95)
    print("Created custom Nick Ho inspired hero background:", path1)

if __name__ == '__main__':
    create_nickho_style_hero()
