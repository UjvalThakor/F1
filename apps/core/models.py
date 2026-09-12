from django.db import models

class SiteSetting(models.Model):
    site_title = models.CharField(max_length=200, default='MAX VERSTAPPEN — OFFICIAL WORLD CHAMPION')
    tagline = models.CharField(max_length=255, default='PRECISION UNDER PRESSURE.')
    editorial_statement = models.TextField(
        default='Speed is only part of the equation. The difference is created through preparation, precision, consistency and the relentless ability to execute when pressure reaches its highest point.'
    )
    hero_statement = models.CharField(max_length=150, default='EVERY LAP IS A TEST.')
    meta_description = models.TextField(
        default='Official digital experience for 4-time Formula 1 World Champion Max Verstappen. Live race calendar, career history, telemetry statistics, editorial news, and exclusive media.'
    )
    hero_video_url = models.URLField(blank=True, null=True, help_text="Direct link or embedded mp4 for hero reel")
    hero_image = models.ImageField(upload_to='hero/', blank=True, null=True)
    contact_email = models.EmailField(default='contact@verstappen.com')
    active_season = models.PositiveIntegerField(default=2026)
    footer_text = models.CharField(max_length=255, default='© 2026 MAX VERSTAPPEN. ALL RIGHTS RESERVED.')

    class Meta:
        verbose_name = 'Site Configuration'
        verbose_name_plural = 'Site Configuration'

    def __str__(self):
        return self.site_title

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(id=1)
        return obj

class SocialLink(models.Model):
    PLATFORM_CHOICES = [
        ('instagram', 'Instagram'),
        ('x', 'X / Twitter'),
        ('youtube', 'YouTube'),
        ('facebook', 'Facebook'),
        ('tiktok', 'TikTok'),
        ('linkedin', 'LinkedIn'),
    ]
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    label = models.CharField(max_length=100)
    url = models.URLField()
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order']
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'

    def __str__(self):
        return f"{self.get_platform_display()} - {self.label}"
