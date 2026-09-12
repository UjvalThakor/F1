from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('robots.txt', views.robots_txt, name='robots_txt'),
]
