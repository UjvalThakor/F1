from rest_framework import serializers
from .models import RaceEvent

class NextRaceSerializer(serializers.ModelSerializer):
    round_formatted = serializers.ReadOnlyField()
    formatted_date_range = serializers.ReadOnlyField()
    iso_target = serializers.DateTimeField(source='race_time_utc')

    class Meta:
        model = RaceEvent
        fields = [
            'id', 'season', 'round_number', 'round_formatted', 'name',
            'official_title', 'circuit', 'city', 'country', 'laps',
            'circuit_length', 'lap_record', 'formatted_date_range',
            'iso_target', 'status'
        ]
