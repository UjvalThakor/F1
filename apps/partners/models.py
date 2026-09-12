from django.db import models

class Partner(models.Model):
    TIER_CHOICES = [
        ('TITLE', 'Title Partner'),
        ('PRINCIPAL', 'Principal Partner'),
        ('OFFICIAL', 'Official Partner'),
        ('TECHNICAL', 'Technical Supplier'),
    ]

    name = models.CharField(max_length=150)
    logo = models.ImageField(upload_to='partners/', blank=True, null=True)
    svg_logo = models.TextField(blank=True, help_text="Optional inline SVG logo for crisp monochrome rendering")
    website = models.URLField(blank=True)
    tier = models.CharField(max_length=50, choices=TIER_CHOICES, default='OFFICIAL')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Partner'
        verbose_name_plural = 'Partners'

    def __str__(self):
        return f"{self.name} ({self.get_tier_display()})"
