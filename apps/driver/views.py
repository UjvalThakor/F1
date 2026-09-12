from django.shortcuts import render
from .models import DriverProfile, DriverStatistic, DriverPillar

def about_view(request):
    profile = DriverProfile.get_active_profile()
    stats = DriverStatistic.objects.filter(is_active=True).order_by('display_order')
    pillars = DriverPillar.objects.filter(is_active=True).order_by('display_order')
    return render(request, 'pages/about.html', {
        'profile': profile,
        'stats': stats,
        'pillars': pillars,
    })
