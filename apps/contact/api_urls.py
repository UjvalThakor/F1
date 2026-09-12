from django.urls import path
from . import api_views

urlpatterns = [
    path('submit/', api_views.contact_api, name='api_contact_submit'),
]
