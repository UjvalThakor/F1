from django import forms
from .models import ContactMessage

class ContactForm(forms.ModelForm):
    # Honeypot field for anti-spam bots
    bot_catcher = forms.CharField(
        required=False,
        widget=forms.HiddenInput,
        label="Leave blank"
    )

    class Meta:
        model = ContactMessage
        fields = ['first_name', 'last_name', 'email', 'subject', 'message']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'FIRST NAME *',
                'required': True,
                'autocomplete': 'given-name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'LAST NAME *',
                'required': True,
                'autocomplete': 'family-name'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-input',
                'placeholder': 'EMAIL ADDRESS *',
                'required': True,
                'autocomplete': 'email'
            }),
            'subject': forms.Select(attrs={
                'class': 'form-select',
                'required': True,
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'YOUR MESSAGE / INQUIRY *',
                'rows': 4,
                'required': True
            }),
        }

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get('bot_catcher'):
            raise forms.ValidationError("Automated submission detected.")
        return cleaned_data
