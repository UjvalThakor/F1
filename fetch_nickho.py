import urllib.request
import re

req = urllib.request.Request('https://nickho-motorsports.nl/', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

with open('nickho_dump.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved nickho_dump.html. Length:", len(html))

# Find CSS
css_files = re.findall(r'href="(https://[^\"]+\.css)"', html)
print("CSS files:", css_files)

# Find Images
images = re.findall(r'(https://cdn\.prod\.website-files\.com/[^\s\"\'>]+\.(?:jpg|jpeg|png|webp))', html, re.IGNORECASE)
print(f"Found {len(images)} images. First 15:")
for img in images[:15]:
    print("  ", img)
