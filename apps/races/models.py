from django.db import models
from django.utils import timezone

class RaceEvent(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('next', 'Next Race (Target)'),
        ('upcoming', 'Upcoming'),
    ]

    season = models.PositiveIntegerField(default=2026)
    round_number = models.PositiveIntegerField(help_text="Round 01, 02, etc.")
    name = models.CharField(max_length=150, help_text="e.g. Monaco Grand Prix")
    official_title = models.CharField(max_length=200, blank=True)
    circuit = models.CharField(max_length=150, help_text="e.g. Circuit de Monaco")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    
    date_start = models.DateField()
    date_end = models.DateField()
    race_time_utc = models.DateTimeField(
        help_text="Exact UTC timestamp for countdown calculation"
    )
    
    laps = models.PositiveIntegerField(default=72)
    circuit_length = models.CharField(max_length=50, default='4.259 km')
    lap_record = models.CharField(max_length=100, blank=True, default='1:11.097')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    result = models.CharField(max_length=100, blank=True, help_text="e.g. 'P1 — WINNER', 'POLE & WIN'")
    
    image = models.ImageField(upload_to='races/', blank=True, null=True)
    circuit_layout_svg = models.TextField(blank=True, help_text="Inline SVG path data for circuit outline")
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['round_number']
        verbose_name = 'Race Event'
        verbose_name_plural = 'Race Events'

    def __str__(self):
        return f"Round {self.round_number:02d}: {self.name} ({self.country})"

    @property
    def is_past(self):
        return self.race_time_utc < timezone.now()

    @property
    def round_formatted(self):
        return f"ROUND {self.round_number:02d}"

    @property
    def formatted_date_range(self):
        start_day = self.date_start.strftime("%d")
        end_day = self.date_end.strftime("%d %b %Y")
        if self.date_start.month == self.date_end.month:
            return f"{start_day}–{end_day}".upper()
        return f"{self.date_start.strftime('%d %b')} – {end_day}".upper()
