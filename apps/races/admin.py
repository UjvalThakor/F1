from django.contrib import admin
from .models import RaceEvent

@admin.register(RaceEvent)
class RaceEventAdmin(admin.ModelAdmin):
    list_display = ['round_number', 'name', 'circuit', 'country', 'date_start', 'status', 'result']
    list_filter = ['status', 'season', 'country']
    search_fields = ['name', 'circuit', 'city', 'country']
    list_editable = ['status', 'result']
    ordering = ['round_number']
    fieldsets = (
        ('Grand Prix Identification', {
            'fields': ('season', 'round_number', 'name', 'official_title', 'status', 'result')
        }),
        ('Location & Track Details', {
            'fields': ('circuit', 'city', 'country', 'laps', 'circuit_length', 'lap_record')
        }),
        ('Schedule & Countdown', {
            'fields': ('date_start', 'date_end', 'race_time_utc')
        }),
        ('Imagery & Circuit Map', {
            'fields': ('image', 'circuit_layout_svg', 'description')
        }),
    )
