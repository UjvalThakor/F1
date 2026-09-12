from django.shortcuts import render
from .models import GalleryCategory, GalleryImage

def gallery_view(request):
    categories = GalleryCategory.objects.all().order_by('display_order')
    active_category = request.GET.get('category')
    
    images = GalleryImage.objects.select_related('category').filter(is_published=True)
    if active_category:
        images = images.filter(category__slug=active_category)
    
    images = images.order_by('display_order')
    
    return render(request, 'pages/gallery.html', {
        'categories': categories,
        'images': images,
        'active_category': active_category,
    })
