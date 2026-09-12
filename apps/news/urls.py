from django.urls import path
from . import views

urlpatterns = [
    path('', views.news_list_view, name='news_list'),
    path('<slug:slug>/', views.news_detail_view, name='news_detail'),
]
