from django.db import models

class VideoClip(models.Model):
    title = models.CharField(max_length=200, default='THE PURSUIT OF SPEED')
    subtitle = models.CharField(max_length=255, default='AN INSIDE LOOK AT WORLD CHAMPIONSHIP FOCUS')
    duration = models.CharField(max_length=20, default='02:45')
    poster = models.ImageField(upload_to='videos/posters/', blank=True, null=True)
    video_url = models.URLField(
        default='https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        help_text="Direct MP4 video URL or YouTube embed URL for lightbox playback"
    )
    is_featured = models.BooleanField(default=True, help_text="Highlighted on homepage film section")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', '-id']
        verbose_name = 'Cinematic Video'
        verbose_name_plural = 'Cinematic Videos'

    def __str__(self):
        return f"{self.title} ({self.duration})"
