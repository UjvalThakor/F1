"""
URL configuration for Max Verstappen F1 Website.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from apps.core.sitemaps import StaticViewSitemap, NewsArticleSitemap

sitemaps = {
    'static': StaticViewSitemap,
    'news': NewsArticleSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Core pages & sections
    path('', include('apps.core.urls')),
    path('about/', include('apps.driver.urls')),
    path('career/', include('apps.career.urls')),
    path('races/', include('apps.races.urls')),
    path('gallery/', include('apps.gallery.urls')),
    path('news/', include('apps.news.urls')),
    path('contact/', include('apps.contact.urls')),
    
    # API endpoints for interactive dynamic frontend (Lenis, GSAP, countdown, lightbox)
    path('api/', include([
        path('races/', include('apps.races.api_urls')),
        path('contact/', include('apps.contact.api_urls')),
        path('driver/', include('apps.driver.api_urls')),
    ])),
    
    # SEO
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
