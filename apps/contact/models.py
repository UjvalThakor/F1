from django.db import models

class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]

    SUBJECT_CHOICES = [
        ('partnership', 'Brand Partnership & Sponsorship'),
        ('media', 'Press & Media Inquiry'),
        ('fan', 'Fan Message & Community'),
        ('general', 'General Business Inquiry'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, default='partnership')
    message = models.TextField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.email} ({self.get_subject_display()})"
