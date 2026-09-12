from django.contrib import admin
from django.utils.html import format_html
from .models import GalleryCategory, GalleryImage

@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'display_order']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['display_order']

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['thumbnail_preview', 'title', 'category', 'aspect_ratio', 'display_order', 'is_featured', 'is_published']
    list_filter = ['category', 'aspect_ratio', 'is_featured', 'is_published']
    search_fields = ['title', 'caption', 'location']
    list_editable = ['display_order', 'is_featured', 'is_published']

    def thumbnail_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "No image"
    thumbnail_preview.short_description = "Preview"
