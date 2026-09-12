from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import DriverStatistic
from .serializers import DriverStatisticSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def stats_api(request):
    stats = DriverStatistic.objects.filter(is_active=True).order_by('display_order')
    serializer = DriverStatisticSerializer(stats, many=True)
    return Response(serializer.data)
