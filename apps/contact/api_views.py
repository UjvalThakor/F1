from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .forms import ContactForm

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_api(request):
    form = ContactForm(request.data)
    if form.is_valid():
        contact = form.save(commit=False)
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            contact.ip_address = x_forwarded_for.split(',')[0]
        else:
            contact.ip_address = request.META.get('REMOTE_ADDR')
        contact.save()
        return Response({
            'status': 'success',
            'message': 'Transmission received. Management will review your inquiry shortly.'
        }, status=201)
    else:
        return Response({
            'status': 'error',
            'errors': form.errors
        }, status=400)
