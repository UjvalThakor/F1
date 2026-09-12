from django.contrib import admin
from .models import CareerEvent

@admin.register(CareerEvent)
class CareerEventAdmin(admin.ModelAdmin):
    list_display = ['year', 'title', 'category', 'highlight_badge', 'display_order', 'is_highlight']
    list_filter = ['category', 'is_highlight']
    search_fields = ['year', 'title', 'description', 'highlight_badge']
    list_editable = ['display_order', 'is_highlight']
