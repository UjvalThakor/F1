from django.shortcuts import render
from .models import RaceEvent

def races_view(request):
    races = RaceEvent.objects.all().order_by('round_number')
    next_race = RaceEvent.objects.filter(status='next').first()
    if not next_race:
        next_race = RaceEvent.objects.filter(status='upcoming').order_by('date_start').first()
    
    return render(request, 'pages/races.html', {
        'races': races,
        'next_race': next_race,
    })
