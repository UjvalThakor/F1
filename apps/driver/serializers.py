from rest_framework import serializers
from .models import DriverStatistic, DriverProfile

class DriverStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverStatistic
        fields = ['id', 'title', 'value', 'prefix', 'suffix', 'description']

class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = ['first_name', 'last_name', 'racing_number', 'team', 'nationality', 'quote']
