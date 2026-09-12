from django.shortcuts import render, get_object_or_404
from .models import NewsArticle, NewsCategory

def news_list_view(request):
    categories = NewsCategory.objects.all()
    active_category = request.GET.get('category')
    
    articles = NewsArticle.objects.filter(is_published=True)
    if active_category:
        articles = articles.filter(category__slug=active_category)
    
    return render(request, 'pages/news_list.html', {
        'categories': categories,
        'articles': articles,
        'active_category': active_category,
    })

def news_detail_view(request, slug):
    article = get_object_or_404(NewsArticle, slug=slug, is_published=True)
    related_articles = NewsArticle.objects.filter(
        is_published=True
    ).exclude(id=article.id).order_by('-published_at')[:3]
    
    return render(request, 'pages/news_detail.html', {
        'article': article,
        'related_articles': related_articles,
    })
