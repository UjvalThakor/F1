from .models import SiteSetting, SocialLink

def site_globals(request):
    try:
        settings_obj = SiteSetting.get_settings()
        socials = SocialLink.objects.filter(is_active=True).order_by('display_order')
    except Exception:
        settings_obj = None
        socials = []
    
    return {
        'site_settings': settings_obj,
        'social_links': socials,
    }
