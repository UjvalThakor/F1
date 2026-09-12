from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from apps.news.models import NewsArticle

class StaticViewSitemap(Sitemap):
    priority = 0.9
    changefreq = 'weekly'

    def items(self):
        return ['home', 'about', 'career', 'races', 'gallery', 'news_list', 'contact']

    def location(self, item):
        return reverse(item)

class NewsArticleSitemap(Sitemap):
    priority = 0.8
    changefreq = 'daily'

    def items(self):
        return NewsArticle.objects.filter(is_published=True)

    def lastmod(self, obj):
        return obj.published_at
