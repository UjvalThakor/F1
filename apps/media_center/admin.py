from django.contrib import admin
from .models import VideoClip

@admin.register(VideoClip)
class VideoClipAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration', 'is_featured', 'display_order']
    list_editable = ['is_featured', 'display_order']
