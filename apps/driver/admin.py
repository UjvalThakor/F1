from django.contrib import admin
from .models import DriverProfile, DriverStatistic, DriverPillar

@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'racing_number', 'team', 'is_active']
    fieldsets = (
        ('Driver Identity', {
            'fields': ('first_name', 'last_name', 'racing_number', 'permanent_number', 'team', 'nationality')
        }),
        ('Personal Details', {
            'fields': ('birth_date', 'birth_place', 'residence')
        }),
        ('Editorial & Story', {
            'fields': ('quote', 'intro_statement', 'biography_intro', 'biography_full')
        }),
        ('Imagery', {
            'fields': ('portrait_image', 'action_image', 'helmet_image')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )

@admin.register(DriverStatistic)
class DriverStatisticAdmin(admin.ModelAdmin):
    list_display = ['title', 'prefix', 'value', 'suffix', 'display_order', 'is_active']
    list_editable = ['value', 'suffix', 'display_order', 'is_active']

@admin.register(DriverPillar)
class DriverPillarAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'display_order', 'is_active']
    list_editable = ['display_order', 'is_active']
