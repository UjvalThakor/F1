from django.contrib import admin
from .models import Partner

@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'tier', 'website', 'display_order', 'is_active']
    list_filter = ['tier', 'is_active']
    search_fields = ['name']
    list_editable = ['tier', 'display_order', 'is_active']
