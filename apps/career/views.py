from django.shortcuts import render
from .models import CareerEvent

def career_view(request):
    events = CareerEvent.objects.all().order_by('display_order', 'year')
    return render(request, 'pages/career.html', {
        'events': events,
    })
