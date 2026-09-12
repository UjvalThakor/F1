from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import RaceEvent
from .serializers import NextRaceSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def next_race_api(request):
    next_race = RaceEvent.objects.filter(status='next').first()
    if not next_race:
        next_race = RaceEvent.objects.filter(status='upcoming').order_by('date_start').first()
    
    if not next_race:
        return Response({'detail': 'No upcoming races scheduled.'}, status=404)
    
    serializer = NextRaceSerializer(next_race)
    return Response(serializer.data)
