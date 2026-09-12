from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.utils import timezone

class NewsCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name = 'News Category'
        verbose_name_plural = 'News Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class NewsArticle(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(NewsCategory, on_delete=models.SET_NULL, null=True, related_name='articles')
    excerpt = models.TextField(help_text="Short teaser for homepage cards")
    content = models.TextField(help_text="Full editorial body content")
    featured_image = models.ImageField(upload_to='news/')
    reading_time = models.CharField(max_length=50, default='3 MIN READ')
    published_at = models.DateTimeField(default=timezone.now)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-published_at']
        verbose_name = 'News Article'
        verbose_name_plural = 'News Articles'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('news_detail', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title
