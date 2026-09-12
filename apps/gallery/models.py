from django.db import models
from django.utils.text import slugify

class GalleryCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Gallery Category'
        verbose_name_plural = 'Gallery Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class GalleryImage(models.Model):
    ASPECT_RATIOS = [
        ('landscape', 'Landscape (16:9)'),
        ('portrait', 'Portrait (3:4)'),
        ('square', 'Square (1:1)'),
        ('wide', 'Ultra Wide (21:9)'),
    ]

    category = models.ForeignKey(GalleryCategory, on_delete=models.CASCADE, related_name='images')
    title = models.CharField(max_length=200)
    caption = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=150, blank=True)
    year = models.PositiveIntegerField(default=2024)
    image = models.ImageField(upload_to='gallery/')
    aspect_ratio = models.CharField(max_length=20, choices=ASPECT_RATIOS, default='landscape')
    display_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', '-id']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'

    def __str__(self):
        return f"{self.title} [{self.category.name}]"
