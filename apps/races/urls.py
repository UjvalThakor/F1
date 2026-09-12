from django.urls import path
from . import views

urlpatterns = [
    path('', views.races_view, name='races'),
]
