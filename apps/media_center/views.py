from django.shortcuts import render
from .models import VideoClip

def media_view(request):
    videos = VideoClip.objects.all().order_by('display_order')
    return render(request, 'pages/media.html', {'videos': videos})
