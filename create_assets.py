import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

BASE_DIR = Path(__file__).resolve().parent
STATIC_IMG = BASE_DIR / 'static' / 'images'
MEDIA_DIR = BASE_DIR / 'media'
STATIC_IMG.mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / 'hero').mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / 'driver' / 'portrait').mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / 'career').mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / 'races').mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / 'gallery').mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / 'news').mkdir(parents=True, exist_ok=True)
(MEDIA_DIR / 'videos' / 'posters').mkdir(parents=True, exist_ok=True)

def create_carbon_base(width, height, base_color=(8, 8, 8)):
    img = Image.new('RGB', (width, height), base_color)
    draw = ImageDraw.Draw(img)
    # Subtle diagonal carbon weave lines
    for i in range(0, width + height, 8):
        draw.line([(0, i), (i, 0)], fill=(14, 14, 14), width=1)
    return img

def create_hero_image():
    w, h = 1920, 1080
    img = create_carbon_base(w, h, (5, 5, 6))
    draw = ImageDraw.Draw(img)

    # Ambient deep red & dark navy gradients
    for r in range(h // 2, 0, -10):
        alpha = int(35 * (1 - r / (h / 2)))
        draw.ellipse([w*0.65 - r*1.8, h*0.4 - r, w*0.65 + r*1.8, h*0.4 + r], outline=(225, 6, 0, alpha))
        draw.ellipse([w*0.25 - r*1.5, h*0.7 - r, w*0.25 + r*1.5, h*0.7 + r], outline=(6, 29, 66, alpha))

    # Racing track curbs (red and white)
    curb_y = int(h * 0.82)
    curb_w = 70
    for i in range(0, w + curb_w, curb_w * 2):
        draw.polygon([(i, curb_y), (i + curb_w, curb_y - 20), (i + curb_w * 1.6, h), (i + curb_w * 0.6, h)], fill=(225, 6, 0))
        draw.polygon([(i + curb_w, curb_y - 20), (i + curb_w * 2, curb_y - 40), (i + curb_w * 2.6, h), (i + curb_w * 1.6, h)], fill=(245, 245, 242))

    # Speed light streaks
    for y in [h*0.35, h*0.45, h*0.52, h*0.68]:
        draw.line([(0, y), (w, y - 40)], fill=(225, 6, 0), width=2)
        draw.line([(w*0.3, y + 10), (w, y - 25)], fill=(255, 215, 0), width=1)

    # Minimalist F1 silhouette / aerodynamic telemetry
    draw.polygon([(w*0.35, h*0.75), (w*0.85, h*0.65), (w*0.9, h*0.72), (w*0.32, h*0.80)], fill=(15, 15, 18))
    # Halo line
    draw.arc([w*0.52, h*0.60, w*0.68, h*0.74], start=180, end=360, fill=(225, 6, 0), width=4)

    # Dark cinematic radial vignette
    vignette = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    vdraw.rectangle([(0, 0), (w, h)], fill=(0, 0, 0, 140))
    vdraw.ellipse([w*0.2, h*0.15, w*0.8, h*0.85], fill=(0, 0, 0, 0))
    vignette = vignette.filter(ImageFilter.GaussianBlur(120))
    img.paste(vignette, (0, 0), vignette)

    path = STATIC_IMG / 'mv_hero.jpg'
    img.save(path, 'JPEG', quality=95)
    img.save(MEDIA_DIR / 'hero' / 'mv_hero.jpg', 'JPEG', quality=95)
    print(f"Created: {path}")

def create_portrait_image():
    w, h = 1200, 1600
    img = create_carbon_base(w, h, (7, 7, 7))
    draw = ImageDraw.Draw(img)

    # Dramatic side studio lighting (chiaroscuro)
    for i in range(w // 2):
        intensity = int(35 * (1 - i / (w / 2)))
        draw.line([(w - i, 0), (w - i, h)], fill=(intensity, intensity + 4, intensity + 8))

    # Racing suit collar & shoulders silhouette
    draw.polygon([(w*0.1, h), (w*0.3, h*0.58), (w*0.7, h*0.58), (w*0.9, h)], fill=(12, 12, 14))
    # Red Bull racing stripe on suit
    draw.line([(w*0.35, h*0.60), (w*0.25, h)], fill=(225, 6, 0), width=12)
    draw.line([(w*0.65, h*0.60), (w*0.75, h)], fill=(225, 6, 0), width=12)

    # World Champion Gold Decal
    draw.ellipse([w*0.48 - 30, h*0.68 - 30, w*0.48 + 30, h*0.68 + 30], outline=(212, 175, 55), width=3)
    # Number 1 on chest
    draw.line([(w*0.48, h*0.68 - 15), (w*0.48, h*0.68 + 15)], fill=(212, 175, 55), width=4)

    # Vignette
    vignette = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    vdraw.rectangle([(0, 0), (w, h)], fill=(0, 0, 0, 120))
    vdraw.ellipse([w*0.15, h*0.15, w*0.85, h*0.8], fill=(0, 0, 0, 0))
    vignette = vignette.filter(ImageFilter.GaussianBlur(100))
    img.paste(vignette, (0, 0), vignette)

    path = STATIC_IMG / 'mv_portrait.jpg'
    img.save(path, 'JPEG', quality=95)
    img.save(MEDIA_DIR / 'driver' / 'portrait' / 'mv_portrait.jpg', 'JPEG', quality=95)
    print(f"Created: {path}")

def create_editorial_image(name, accent_color, badge_text):
    w, h = 1600, 1000
    img = create_carbon_base(w, h, (9, 9, 10))
    draw = ImageDraw.Draw(img)

    # Dynamic perspective lines
    for i in range(0, w, 80):
        draw.line([(i, h), (w * 0.7, h * 0.2)], fill=(20, 20, 24), width=1)

    # Accent color glow
    for r in range(250, 0, -15):
        alpha = int(40 * (1 - r / 250))
        draw.ellipse([w*0.6 - r*1.5, h*0.4 - r, w*0.6 + r*1.5, h*0.4 + r], outline=(*accent_color, alpha))

    # High speed car contour
    draw.polygon([(w*0.2, h*0.75), (w*0.75, h*0.55), (w*0.82, h*0.65), (w*0.18, h*0.82)], fill=(16, 16, 20))
    # Rear wing
    draw.rectangle([w*0.18, h*0.65, w*0.28, h*0.68], fill=(*accent_color,))

    # Spark showers
    for sx, sy in [(w*0.35, h*0.78), (w*0.42, h*0.76), (w*0.48, h*0.79), (w*0.55, h*0.77)]:
        for angle in range(0, 360, 45):
            rad = math.radians(angle)
            ex = sx + math.cos(rad) * 25
            ey = sy + math.sin(rad) * 12
            draw.line([(sx, sy), (ex, ey)], fill=(255, 200, 50), width=2)

    path = STATIC_IMG / f"{name}.jpg"
    img.save(path, 'JPEG', quality=92)
    img.save(MEDIA_DIR / 'gallery' / f"{name}.jpg", 'JPEG', quality=92)
    img.save(MEDIA_DIR / 'news' / f"{name}.jpg", 'JPEG', quality=92)
    print(f"Created: {path}")

create_hero_image()
create_portrait_image()
create_editorial_image('mv_racing_1', (225, 6, 0), 'RACING')
create_editorial_image('mv_victory', (212, 175, 55), 'VICTORY')
create_editorial_image('mv_car', (6, 29, 66), 'CAR')
create_editorial_image('mv_video_poster', (225, 6, 0), 'FILM')
create_editorial_image('mv_helmet', (212, 175, 55), 'HELMET')
create_editorial_image('mv_paddock', (100, 100, 100), 'PADDOCK')
