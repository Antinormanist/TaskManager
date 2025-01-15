from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model


class UserRegistrationForm(UserCreationForm):
    username = forms.CharField(max_length=64)
    email = forms.EmailField(max_length=255)
    password1 = forms.CharField(max_length=255)
    password2 = forms.CharField(max_length=255)

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password1', 'password2']