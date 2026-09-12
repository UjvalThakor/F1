from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ContactForm

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact = form.save(commit=False)
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                contact.ip_address = x_forwarded_for.split(',')[0]
            else:
                contact.ip_address = request.META.get('REMOTE_ADDR')
            contact.save()
            messages.success(request, "Your message has been delivered to Max Verstappen's management. We will review it shortly.")
            return redirect('contact')
        else:
            messages.error(request, "Please correct the errors below and submit again.")
    else:
        form = ContactForm()
    
    return render(request, 'pages/contact.html', {'form': form})
