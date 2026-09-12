from django.contrib import admin
from .models import SiteSetting, SocialLink

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['site_title', 'active_season', 'contact_email']
    fieldsets = (
        ('Branding & Typography', {
            'fields': ('site_title', 'tagline', 'hero_statement', 'editorial_statement')
        }),
        ('Hero Visuals', {
            'fields': ('hero_image', 'hero_video_url')
        }),
        ('SEO & Meta', {
            'fields': ('meta_description', 'active_season', 'contact_email', 'footer_text')
        }),
    )

    def has_add_permission(self, request):
        # Only permit one singleton settings record
        return not SiteSetting.objects.exists()

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['platform', 'label', 'url', 'display_order', 'is_active']
    list_editable = ['display_order', 'is_active']
