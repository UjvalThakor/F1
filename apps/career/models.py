from django.db import models

class CareerEvent(models.Model):
    CATEGORY_CHOICES = [
        ('KARTING', 'Karting Foundations'),
        ('JUNIOR', 'Junior Single Seaters'),
        ('DEBUT', 'Formula 1 Debut'),
        ('VICTORY', 'First Victory'),
        ('CHAMPION', 'World Championship'),
        ('RECORD', 'Historic Record'),
        ('PRESENT', 'Current Era'),
    ]

    year = models.CharField(max_length=20, help_text="e.g. 2015, 2021, 2024")
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='CHAMPION')
    description = models.TextField()
    highlight_badge = models.CharField(max_length=100, blank=True, help_text="e.g. 'P1 SPAIN', '19 WINS IN A SEASON'")
    image = models.ImageField(upload_to='career/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_highlight = models.BooleanField(default=False)

    class Meta:
        ordering = ['display_order', 'year']
        verbose_name = 'Career Milestone'
        verbose_name_plural = 'Career Milestones'

    def __str__(self):
        return f"{self.year} — {self.title}"
