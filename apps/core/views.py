from django.shortcuts import render
from django.http import HttpResponse
from apps.driver.models import DriverProfile, DriverStatistic, DriverPillar
from apps.career.models import CareerEvent
from apps.races.models import RaceEvent
from apps.gallery.models import GalleryCategory, GalleryImage
from apps.media_center.models import VideoClip
from apps.news.models import NewsArticle
from apps.partners.models import Partner
from apps.contact.forms import ContactForm

def home_view(request):
    driver_profile = DriverProfile.get_active_profile()
    stats = DriverStatistic.objects.filter(is_active=True).order_by('display_order')
    pillars = DriverPillar.objects.filter(is_active=True).order_by('display_order')
    timeline_events = CareerEvent.objects.all().order_by('display_order', 'year')
    
    # Next race & calendar
    next_race = RaceEvent.objects.filter(status='next').first()
    if not next_race:
        next_race = RaceEvent.objects.filter(status='upcoming').order_by('date_start').first()
    
    races = RaceEvent.objects.all().order_by('round_number')
    
    # Gallery
    gallery_categories = GalleryCategory.objects.all().order_by('display_order')
    gallery_images = GalleryImage.objects.select_related('category').filter(is_published=True).order_by('display_order')
    
    # Video
    featured_video = VideoClip.objects.filter(is_featured=True).first()
    
    # News
    latest_news = NewsArticle.objects.filter(is_published=True).order_by('-published_at')[:4]
    
    # Partners
    partners = Partner.objects.filter(is_active=True).order_by('display_order')
    
    contact_form = ContactForm()
    
    context = {
        'profile': driver_profile,
        'stats': stats,
        'pillars': pillars,
        'timeline_events': timeline_events,
        'next_race': next_race,
        'races': races,
        'gallery_categories': gallery_categories,
        'gallery_images': gallery_images,
        'featured_video': featured_video,
        'latest_news': latest_news,
        'partners': partners,
        'contact_form': contact_form,
    }
    return render(request, 'pages/index.html', context)

def robots_txt(request):
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin/",
        "Sitemap: https://maxverstappen.com/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")
