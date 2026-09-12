import os
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.core.models import SiteSetting, SocialLink
from apps.driver.models import DriverProfile, DriverStatistic, DriverPillar
from apps.career.models import CareerEvent
from apps.races.models import RaceEvent
from apps.gallery.models import GalleryCategory, GalleryImage
from apps.media_center.models import VideoClip
from apps.news.models import NewsCategory, NewsArticle
from apps.partners.models import Partner

class Command(BaseCommand):
    help = 'Seeds database with comprehensive authentic Max Verstappen motorsport data'

    def handle(self, *args, **options):
        self.stdout.write("Initializing Max Verstappen database seeding...")

        # 1. Site Settings
        setting = SiteSetting.get_settings()
        setting.site_title = 'MAX VERSTAPPEN — 4x WORLD CHAMPION'
        setting.tagline = 'PRECISION UNDER PRESSURE.'
        setting.hero_statement = 'EVERY LAP IS A TEST.'
        setting.editorial_statement = 'Speed is only part of the equation. The difference is created through preparation, precision, consistency and the relentless ability to execute when pressure reaches its highest point.'
        setting.meta_description = 'Official digital experience for 4-time Formula 1 World Champion Max Verstappen. Live race calendar, career history, telemetry statistics, editorial news, and exclusive media.'
        setting.hero_image = 'hero/mv_hero.jpg'
        setting.hero_video_url = 'https://www.youtube.com/watch?v=k1t6C7bXbSg'
        setting.contact_email = 'management@verstappen.com'
        setting.active_season = 2026
        setting.footer_text = '© 2026 MAX VERSTAPPEN. ALL RIGHTS RESERVED.'
        setting.save()
        self.stdout.write("  [OK] Site Settings populated")

        # 2. Social Links
        SocialLink.objects.all().delete()
        SocialLink.objects.create(platform='instagram', label='@maxverstappen1', url='https://www.instagram.com/maxverstappen1/', display_order=1)
        SocialLink.objects.create(platform='x', label='@Max33Verstappen', url='https://twitter.com/Max33Verstappen', display_order=2)
        SocialLink.objects.create(platform='youtube', label='Max Verstappen', url='https://www.youtube.com/', display_order=3)
        self.stdout.write("  [OK] Social links populated")

        # 3. Driver Profile
        profile = DriverProfile.get_active_profile()
        profile.first_name = 'MAX'
        profile.last_name = 'VERSTAPPEN'
        profile.racing_number = 1
        profile.permanent_number = 33
        profile.team = 'Oracle Red Bull Racing'
        profile.nationality = 'Dutch'
        profile.birth_date = date(1997, 9, 30)
        profile.birth_place = 'Hasselt, Belgium'
        profile.residence = 'Monte Carlo, Monaco'
        profile.quote = 'Every lap is a test. Not just of the car, but of myself.'
        profile.intro_statement = 'For me, racing is about more than chasing speed — it’s about chasing my absolute limits.'
        profile.biography_intro = 'Max Verstappen was born into motorsport heritage, but his historic trajectory was forged through ironclad dedication, unflinching precision, and an instinctive race craft that redefined Formula 1 standards.'
        profile.biography_full = 'From making history as the youngest driver ever to start an F1 Grand Prix at just 17 years old to commanding four consecutive Formula 1 World Championships, Max Verstappen embodies the pinnacle of modern motorsport engineering and driver focus.'
        profile.portrait_image = 'driver/portrait/mv_portrait.jpg'
        profile.save()
        self.stdout.write("  [OK] Driver Profile populated")

        # 4. Driver Statistics
        DriverStatistic.objects.all().delete()
        DriverStatistic.objects.create(title='WORLD CHAMPIONSHIPS', value=4, prefix='', suffix='', description='2021, 2022, 2023, 2024', display_order=1)
        DriverStatistic.objects.create(title='GRAND PRIX WINS', value=63, prefix='', suffix='+', description='3rd Most in Formula 1 History', display_order=2)
        DriverStatistic.objects.create(title='CAREER PODIUMS', value=111, prefix='', suffix='+', description='Over 50% Podium Finish Rate', display_order=3)
        DriverStatistic.objects.create(title='POLE POSITIONS', value=40, prefix='', suffix='+', description='Qualifying Telemetry Benchmark', display_order=4)
        self.stdout.write("  [OK] Driver Statistics populated")

        # 5. Editorial Pillars
        DriverPillar.objects.all().delete()
        DriverPillar.objects.create(
            title='THE DRIVER',
            subtitle='PURE INSTINCT',
            description='Born with racing in his veins, Max possesses an instinctive spatial awareness and tire management ability that allows him to extract 100% from any machinery in any atmospheric condition.',
            display_order=1
        )
        DriverPillar.objects.create(
            title='THE MINDSET',
            subtitle='UNWAVERING RESOLVE',
            description='Unfazed by noise, politics, or external expectations. Verstappen enters every race weekend with singular tunnel vision: total execution from FP1 through the checkered flag.',
            display_order=2
        )
        DriverPillar.objects.create(
            title='THE DISCIPLINE',
            subtitle='RELENTLESS SIMULATOR RUNS',
            description='When not at an F1 circuit, Max is logging hundreds of laps on professional sim rigs and competing in endurance esports races, refining brake-bias modulation and setup balance constantly.',
            display_order=3
        )
        DriverPillar.objects.create(
            title='THE MACHINE',
            subtitle='TECHNICAL HARMONY',
            description='Deep engineering feedback combined with Adrian Newey aerodynamic concepts allowed the RB19 and RB20 to deliver historic milestones and unmatched tire preservation.',
            display_order=4
        )
        self.stdout.write("  [OK] Editorial Pillars populated")

        # 6. Career Timeline Events
        CareerEvent.objects.all().delete()
        milestones = [
            ("2015", "Formula 1 Debut with Scuderia Toro Rosso", "Youngest Driver in F1 History", "DEBUT", "Debuted at 17 years, 166 days at the Australian Grand Prix, scoring championship points in his second race at Sepang.", "HISTORIC DEBUT", 1, False),
            ("2016", "First Grand Prix Victory in Spain", "Youngest Grand Prix Winner", "VICTORY", "Promoted to Red Bull Racing ahead of Barcelona. Qualified P4 and held off Kimi Räikkönen for 30 laps to claim maiden victory on debut.", "MAIDEN WIN", 2, True),
            ("2019", "First Honda Win in the Hybrid Era", "Austria & Germany Masterclass", "RECORD", "Delivered Honda their first Formula 1 victory since 2006 at the Red Bull Ring, launching a dominant technical partnership.", "HONDA TRIUMPH", 3, False),
            ("2021", "First World Championship Title", "Abu Dhabi Championship Triumph", "CHAMPION", "Clinched his first Formula 1 World Drivers' Championship after a legendary season-long duel, finishing with 10 wins and 18 podiums.", "WORLD CHAMPION #1", 4, True),
            ("2022", "Second World Championship Crown", "15 Wins in a Single Season", "CHAMPION", "Dominated the championship, clinching the title at Suzuka with four races to spare and establishing a new record of 15 victories in one season.", "WORLD CHAMPION #2", 5, True),
            ("2023", "The Most Dominant Season in F1 History", "19 Wins & 10 Consecutive Victories", "RECORD", "Rewrote motorsport records: 19 wins in 22 races, 10 consecutive victories, over 1,000 laps led, and 575 championship points.", "RECORD 86.4% WIN RATE", 6, True),
            ("2024", "Fourth Consecutive World Championship", "Brazil Masterclass P17 to P1", "CHAMPION", "Secured his fourth consecutive World Championship. Highlighted by an all-time wet-weather drive in São Paulo, winning from 17th on the grid.", "WORLD CHAMPION #4", 7, True),
            ("2026", "The Ongoing Pursuit of Greatness", "Challenging the Benchmark", "PRESENT", "Continuing at the pinnacle of international motorsport with Oracle Red Bull Racing, targeting further titles and breaking all records.", "ACTIVE ERA", 8, False),
        ]
        for year, title, subtitle, category, desc, badge, order, highlight in milestones:
            CareerEvent.objects.create(
                year=year,
                title=title,
                subtitle=subtitle,
                category=category,
                description=desc,
                highlight_badge=badge,
                display_order=order,
                is_highlight=highlight
            )
        self.stdout.write("  [OK] Career Timeline populated")

        # 7. Race Calendar & Next Race
        RaceEvent.objects.all().delete()
        # Set next race target 12 days in the future for a live ticking countdown
        now = timezone.now()
        target_countdown_time = now + timedelta(days=11, hours=14, minutes=32, seconds=18)

        races_data = [
            (2026, 1, "Bahrain Grand Prix", "Bahrain International Circuit", "Sakhir", "Bahrain", date(2026, 2, 28), date(2026, 3, 2), 57, "5.412 km", "1:31.447", "completed", "P1 — WINNER"),
            (2026, 2, "Saudi Arabian Grand Prix", "Jeddah Corniche Circuit", "Jeddah", "Saudi Arabia", date(2026, 3, 7), date(2026, 3, 9), 50, "6.174 km", "1:30.734", "completed", "P1 — WINNER"),
            (2026, 3, "Australian Grand Prix", "Albert Park Circuit", "Melbourne", "Australia", date(2026, 3, 21), date(2026, 3, 23), 58, "5.278 km", "1:19.813", "completed", "P1 — WINNER"),
            (2026, 4, "Japanese Grand Prix", "Suzuka International Racing Course", "Suzuka", "Japan", date(2026, 4, 4), date(2026, 4, 6), 53, "5.807 km", "1:30.983", "completed", "P1 — WINNER"),
            (2026, 5, "Chinese Grand Prix", "Shanghai International Circuit", "Shanghai", "China", date(2026, 4, 18), date(2026, 4, 20), 56, "5.451 km", "1:32.238", "completed", "P1 — WINNER"),
            (2026, 6, "Miami Grand Prix", "Miami International Autodrome", "Miami", "United States", date(2026, 5, 2), date(2026, 5, 4), 57, "5.412 km", "1:29.708", "completed", "P1 — WINNER"),
            (2026, 7, "Emilia Romagna Grand Prix", "Autodromo Enzo e Dino Ferrari", "Imola", "Italy", date(2026, 5, 16), date(2026, 5, 18), 63, "4.909 km", "1:15.484", "completed", "P1 — WINNER"),
            (2026, 8, "Monaco Grand Prix", "Circuit de Monaco", "Monte Carlo", "Monaco", date(2026, 5, 22), date(2026, 5, 24), 78, "3.337 km", "1:12.909", "next", ""),
            (2026, 9, "Spanish Grand Prix", "Circuit de Barcelona-Catalunya", "Barcelona", "Spain", date(2026, 6, 5), date(2026, 6, 7), 66, "4.657 km", "1:16.330", "upcoming", ""),
            (2026, 10, "Canadian Grand Prix", "Circuit Gilles-Villeneuve", "Montreal", "Canada", date(2026, 6, 19), date(2026, 6, 21), 70, "4.361 km", "1:13.078", "upcoming", ""),
            (2026, 11, "Austrian Grand Prix", "Red Bull Ring", "Spielberg", "Austria", date(2026, 7, 3), date(2026, 7, 5), 71, "4.318 km", "1:05.619", "upcoming", ""),
            (2026, 12, "British Grand Prix", "Silverstone Circuit", "Silverstone", "United Kingdom", date(2026, 7, 17), date(2026, 7, 19), 52, "5.891 km", "1:27.097", "upcoming", ""),
            (2026, 13, "Belgian Grand Prix", "Circuit de Spa-Francorchamps", "Stavelot", "Belgium", date(2026, 7, 31), date(2026, 8, 2), 44, "7.004 km", "1:46.286", "upcoming", ""),
            (2026, 14, "Dutch Grand Prix", "Circuit Zandvoort", "Zandvoort", "Netherlands", date(2026, 8, 28), date(2026, 8, 30), 72, "4.259 km", "1:11.097", "upcoming", ""),
            (2026, 15, "Italian Grand Prix", "Autodromo Nazionale Monza", "Monza", "Italy", date(2026, 9, 4), date(2026, 9, 6), 53, "5.793 km", "1:21.046", "upcoming", ""),
        ]

        for s, rnd, name, circ, city, country, ds, de, laps, clen, lrec, st, res in races_data:
            r_time = target_countdown_time if st == 'next' else timezone.make_aware(timezone.datetime.combine(de, timezone.datetime.min.time()) + timedelta(hours=14))
            RaceEvent.objects.create(
                season=s,
                round_number=rnd,
                name=name,
                circuit=circ,
                city=city,
                country=country,
                date_start=ds,
                date_end=de,
                race_time_utc=r_time,
                laps=laps,
                circuit_length=clen,
                lap_record=lrec,
                status=st,
                result=res,
                description=f"Official Formula 1 Grand Prix event at {circ}."
            )
        self.stdout.write("  [OK] Race Calendar & Next Race populated")

        # 8. Gallery Categories & Images
        GalleryCategory.objects.all().delete()
        GalleryImage.objects.all().delete()

        cat_racing = GalleryCategory.objects.create(name='RACING', slug='racing', display_order=1)
        cat_victory = GalleryCategory.objects.create(name='VICTORY', slug='victory', display_order=2)
        cat_car = GalleryCategory.objects.create(name='CAR', slug='car', display_order=3)
        cat_portraits = GalleryCategory.objects.create(name='PORTRAITS', slug='portraits', display_order=4)
        cat_paddock = GalleryCategory.objects.create(name='PADDOCK', slug='paddock', display_order=5)
        cat_helmet = GalleryCategory.objects.create(name='HELMET', slug='helmet', display_order=6)

        GalleryImage.objects.create(category=cat_racing, title='Apex Precision under Floodlights', location='Bahrain International Circuit', year=2024, image='gallery/mv_racing_1.jpg', aspect_ratio='landscape', display_order=1)
        GalleryImage.objects.create(category=cat_victory, title='World Championship Crown No. 4', location='Las Vegas Strip Circuit', year=2024, image='gallery/mv_victory.jpg', aspect_ratio='landscape', display_order=2)
        GalleryImage.objects.create(category=cat_car, title='RB20 Aerodynamic Ground Effect', location='Circuit de Spa-Francorchamps', year=2024, image='gallery/mv_car.jpg', aspect_ratio='landscape', display_order=3)
        GalleryImage.objects.create(category=cat_portraits, title='Editorial Studio Session — The Focus', location='Monte Carlo', year=2024, image='gallery/mv_portrait.jpg', aspect_ratio='portrait', display_order=4)
        GalleryImage.objects.create(category=cat_paddock, title='Garage Debrief & Telemetry Analysis', location='Circuit Zandvoort', year=2024, image='gallery/mv_paddock.jpg', aspect_ratio='landscape', display_order=5)
        GalleryImage.objects.create(category=cat_helmet, title='Gold Championship Helmet — Dutch Lion Edition', location='Milton Keynes', year=2024, image='gallery/mv_helmet.jpg', aspect_ratio='landscape', display_order=6)
        self.stdout.write("  [OK] Gallery Categories & Images populated")

        # 9. Video Clip
        VideoClip.objects.all().delete()
        VideoClip.objects.create(
            title='THE PURSUIT OF SPEED',
            subtitle='AN INSIDE LOOK AT WORLD CHAMPIONSHIP FOCUS',
            duration='02:45',
            poster='videos/posters/mv_video_poster.jpg',
            video_url='https://www.youtube.com/watch?v=k1t6C7bXbSg',
            is_featured=True,
            display_order=1
        )
        self.stdout.write("  [OK] Video Clip populated")

        # 10. News Articles
        NewsCategory.objects.all().delete()
        NewsArticle.objects.all().delete()

        cat_champ = NewsCategory.objects.create(name='CHAMPIONSHIP', slug='championship')
        cat_tech = NewsCategory.objects.create(name='TELEMETRY & TECH', slug='tech')
        cat_press = NewsCategory.objects.create(name='PRESS RELEASES', slug='press')

        NewsArticle.objects.create(
            title='São Paulo Masterclass: The Science of Driving in the Rain',
            slug='sao-paulo-rain-masterclass',
            category=cat_champ,
            excerpt='How Max drove from 17th on the grid to victory in monsoon conditions, producing 17 consecutive fastest laps.',
            content="""The 2024 São Paulo Grand Prix will be remembered as one of the definitive drives in Formula 1 history. Starting from 17th on the grid after an unlucky red flag during qualifying and a penalty drop, Max Verstappen delivered an absolute clinic in wet-weather race craft.

While rivals struggled for adhesion on the standing water of Interlagos, Verstappen searched for unconventional lines around the outside of Curva do Sol and the Junção braking zone, discovering grip where nobody else dared to look.

Setting 17 consecutive fastest laps once clear of traffic, Max crossed the line with a 19-second margin of victory, effectively putting both hands on his fourth consecutive Formula 1 World Drivers' Championship.""",
            featured_image='news/mv_racing_1.jpg',
            reading_time='4 MIN READ',
            is_featured=True
        )

        NewsArticle.objects.create(
            title='Four Consecutive Titles: The Era of Total Focus',
            slug='four-consecutive-world-titles',
            category=cat_champ,
            excerpt='Reflecting on the mental discipline, simulator preparation, and consistency that forged a four-time world champion.',
            content="""Joining the elite tier of motorsport legends alongside Alain Prost, Sebastian Vettel, Juan Manuel Fangio, Michael Schumacher, and Lewis Hamilton, Max Verstappen’s fourth consecutive world title cements his legacy.

The journey began not in the glare of the paddock spotlights, but in the relentless junior karting days traversing Europe in a van with his father Jos. That foundation forged an unflinching temperament where pressure is merely an input to be calibrated and mastered.

As Formula 1 enters an exciting new technical era, Verstappen continues to set the benchmark against which all rivals are measured.""",
            featured_image='news/mv_victory.jpg',
            reading_time='5 MIN READ',
            is_featured=True
        )

        NewsArticle.objects.create(
            title='Aero Telemetry & High Speed Stability: Inside the RB20/RB21',
            slug='aero-telemetry-high-speed-stability',
            category=cat_tech,
            excerpt='An engineering breakdown of how active vehicle dynamics and tire thermal balance match Max Verstappen’s sharp driving style.',
            content="""Max Verstappen is known among Red Bull engineers for desiring a fiercely responsive front axle. A car that turns on a razor's edge with immediate bite on turn-in, while allowing his superior vehicle control to manage the rear instability on exit.

The aerodynamic package developed at Milton Keynes harmonized ground-effect venturi tunnels with precise underbody airflow extraction, keeping downforce consistent across all pitch and roll angles.

This technical harmony allowed Verstappen to maximize minimum cornering speeds without inducing detrimental tire scrub, an indispensable factor in securing pole positions across disparate track topologies.""",
            featured_image='news/mv_car.jpg',
            reading_time='3 MIN READ',
            is_featured=False
        )
        self.stdout.write("  [OK] News Articles populated")

        # 11. Partners
        Partner.objects.all().delete()
        partners = [
            ("ORACLE RED BULL RACING", "TITLE", "https://www.redbullracing.com/", 1),
            ("HONDA RACING", "PRINCIPAL", "https://honda.racing/", 2),
            ("EA SPORTS", "OFFICIAL", "https://www.ea.com/", 3),
            ("HEINEKEN 0.0", "OFFICIAL", "https://www.heineken.com/", 4),
            ("TAG HEUER", "OFFICIAL", "https://www.tagheuer.com/", 5),
            ("MOBIL 1", "TECHNICAL", "https://www.mobil.com/", 6),
        ]
        for name, tier, url, order in partners:
            Partner.objects.create(
                name=name,
                tier=tier,
                website=url,
                display_order=order
            )
        self.stdout.write("  [OK] Global Partners populated")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully! All sections are fully populated."))
