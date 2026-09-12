# Max Verstappen — Formula 1 World Champion Interactive Platform

A high-performance interactive website dedicated to 4-time Formula 1 World Champion Max Verstappen and Oracle Red Bull Racing. Built with Django, Vanilla CSS, GSAP ScrollTrigger, and Lenis Smooth Scroll.

Inspired by cutting-edge motorsport web experiences, including the 1:1 reverse-engineered interactive race calendar from Nick Ho Motorsports with a top-down moveable Red Bull F1 car.

---

## Key Features

- **Fullscreen Cinematic Hero**: Full-viewport visual stage featuring Oracle Red Bull Racing pit garage and Max Verstappen telemetry.
- **Moveable Red Bull F1 Car Calendar**:
  - Top-down Red Bull Formula 1 car zooms into screen center as you scroll.
  - Natural mouse wheel / trackpad scrolling glides through the 2026 racing calendar.
  - Each race item and dividing line illuminates in bright gold/yellow (`#FED60A`) as it crosses the center line.
  - Car accelerates forward off the screen past the 10th race into the finish line.
  - Full reverse scroll support: scrolling up reverses the car and resets race highlights.
  - Strict boundary containment ensuring the car never overlaps onto the Hero section.
- **Fluid Typography & Premium Aesthetics**: Responsive clamp-based sizing, dark aesthetic, and smooth micro-interactions.

---

## Tech Stack

- **Backend**: Python / Django
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Animation & Scroll**: GSAP 3, ScrollTrigger, Lenis Smooth Scroll

---

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/UjvalThakor/F1.git
   cd F1
   ```

2. **Set up Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run Migrations & Start Server**:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

4. **Open in Browser**:
   Visit [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## License

All media and branding assets belong to their respective copyright holders.
