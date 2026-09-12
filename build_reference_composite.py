import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

BASE_DIR = Path(__file__).resolve().parent
STATIC_IMG = BASE_DIR / 'static' / 'images'
MEDIA_DIR = BASE_DIR / 'media' / 'hero'

def composite_hero():
    w, h = 1920, 1080
    canvas = Image.new('RGB', (w, h), (8, 8, 9))

    # 1. Background: The Red Bull Racing Car & Garage
    car_path = STATIC_IMG / 'mv_rb20_hires.jpg'
    if car_path.exists():
        car_img = Image.open(car_path).convert('RGB')
        # Crop & scale car to fill the right 65% of the screen
        cw, ch = car_img.size
        # Crop focus area of the car
        car_cropped = car_img.crop((int(cw * 0.15), int(ch * 0.1), cw, int(ch * 0.9)))
        car_resized = car_cropped.resize((int(w * 0.85), h), Image.Resampling.LANCZOS)
        # Apply warm golden tone to the car background (matching the yellow Porsche hood in reference)
        enhancer = ImageEnhance.Color(car_resized)
        car_resized = enhancer.enhance(1.2)
        canvas.paste(car_resized, (int(w * 0.25), 0))

    # 2. Warm ambient lighting layer (like the warm garage light in reference)
    warm_overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    w_draw = ImageDraw.Draw(warm_overlay)
    for r in range(500, 0, -25):
        alpha = int(40 * (1 - r / 500))
        w_draw.ellipse([w*0.75 - r*1.5, h*0.3 - r, w*0.75 + r*1.5, h*0.3 + r], fill=(230, 170, 20, alpha))
        w_draw.ellipse([w*0.85 - r, h*0.15 - r*0.7, w*0.85 + r, h*0.15 + r*0.7], fill=(255, 200, 40, alpha))
    warm_overlay = warm_overlay.filter(ImageFilter.GaussianBlur(80))
    canvas.paste(warm_overlay, (0, 0), warm_overlay)

    # 3. Add Driver in Helmet & Suit (Columns 2 & 3: X from 320 to 860)
    driver_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(driver_layer)

    # Torso & Racing Suit (Navy, Red, Yellow Red Bull livery)
    suit_left = int(w * 0.14)
    suit_right = int(w * 0.46)
    d_draw.polygon([(suit_left, h), (int(w*0.22), int(h*0.58)), (int(w*0.38), int(h*0.58)), (suit_right, h)], fill=(12, 18, 32, 255))
    # Red Bull yellow & red suit collar & chest details
    d_draw.polygon([(int(w*0.25), int(h*0.60)), (int(w*0.35), int(h*0.60)), (int(w*0.33), int(h*0.85)), (int(w*0.27), int(h*0.85))], fill=(235, 235, 240, 255))
    d_draw.line([(int(w*0.23), int(h*0.64)), (int(w*0.21), h)], fill=(225, 6, 0, 255), width=14)
    d_draw.line([(int(w*0.37), int(h*0.64)), (int(w*0.39), h)], fill=(225, 6, 0, 255), width=14)

    # Helmet PNG placement
    helmet_path = STATIC_IMG / 'mv_helmet_2024.png'
    if helmet_path.exists():
        helmet_img = Image.open(helmet_path).convert('RGBA')
        hw, hh = helmet_img.size
        # Target helmet size: height ~ 500px, width proportional
        target_hh = int(h * 0.52)
        target_hw = int(hw * (target_hh / hh))
        helmet_scaled = helmet_img.resize((target_hw, target_hh), Image.Resampling.LANCZOS)
        # Position helmet on driver neck (around x = w*0.19, y = h*0.08)
        pos_x = int(w * 0.20)
        pos_y = int(h * 0.10)
        driver_layer.paste(helmet_scaled, (pos_x, pos_y), helmet_scaled)

    canvas.paste(driver_layer, (0, 0), driver_layer)

    # 4. Cinematic Dark Shadow Vignette (Crucial for 100% legibility of left stats and right countdown)
    shadow_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)

    # Column 1 shadow (left 0 to 450px)
    for x in range(480):
        alpha = int(240 * (1 - x / 480))
        s_draw.line([(x, 0), (x, h)], fill=(5, 5, 6, alpha))

    # Column 6 shadow (right 1450 to 1920px)
    for x in range(w - 520, w):
        alpha = int(220 * ((x - (w - 520)) / 520))
        s_draw.line([(x, 0), (x, h)], fill=(5, 5, 6, alpha))

    # Bottom shadow for name & countdown clock
    for y in range(h - 320, h):
        alpha = int(245 * ((y - (h - 320)) / 320))
        s_draw.line([(0, y), (w, y)], fill=(5, 5, 6, alpha))

    canvas.paste(shadow_layer, (0, 0), shadow_layer)

    output_path = STATIC_IMG / 'mv_hero_reference.jpg'
    canvas.save(output_path, 'JPEG', quality=95)
    canvas.save(STATIC_IMG / 'mv_hero.jpg', 'JPEG', quality=95)
    if MEDIA_DIR.exists():
        canvas.save(MEDIA_DIR / 'mv_hero.jpg', 'JPEG', quality=95)
    print("Photographic composite saved successfully to", output_path)

if __name__ == '__main__':
    composite_hero()
