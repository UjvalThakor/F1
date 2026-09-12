from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'subject', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'message']
    readonly_fields = ['first_name', 'last_name', 'email', 'subject', 'message', 'ip_address', 'created_at']
    list_editable = ['status']
    actions = ['mark_as_read', 'mark_as_replied']

    def mark_as_read(self, request, queryset):
        queryset.update(status='read')
    mark_as_read.short_description = "Mark selected messages as Read"

    def mark_as_replied(self, request, queryset):
        queryset.update(status='replied')
    mark_as_replied.short_description = "Mark selected messages as Replied"
