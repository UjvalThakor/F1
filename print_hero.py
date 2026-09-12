with open('nickho_dump.html', encoding='utf-8') as f:
    text = f.read()

start = text.find('id="hero"')
sec_start = text.rfind('<section', 0, start)
sec_end = text.find('</section>', start) + len('</section>')

hero_html = text[sec_start:sec_end]
with open('nickho_hero_extracted.html', 'w', encoding='utf-8') as f:
    f.write(hero_html)

print("Saved nickho_hero_extracted.html. Length:", len(hero_html))
