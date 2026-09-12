from django.contrib import admin
from .models import NewsCategory, NewsArticle

@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'reading_time', 'published_at', 'is_featured', 'is_published']
    list_filter = ['category', 'is_featured', 'is_published', 'published_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'is_published']
