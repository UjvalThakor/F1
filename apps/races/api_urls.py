from django.urls import path
from . import api_views

urlpatterns = [
    path('next/', api_views.next_race_api, name='api_next_race'),
]
