from random import randint

from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponse
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

from .models import User
from .utils import HTML_EMAIL_CODE_MSG

# Create your views here.
def sign_in(request):
    if request.method == 'POST':
        data = request.POST.copy()
        if data.get('success'):
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                login(request, user)
                return JsonResponse({'successUrl': 'https://google.com'})
        else:
            if not User.objects.filter(username=data.get('username')).exists():
                return JsonResponse({'status': 404, 'message': 'no user with such username'})
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                code = randint(1000, 9999)
                email = user.email
                # GIVE THAT TASK TO CELERY
                subject = "Tasko authentication"
                from_email = settings.EMAIL_HOST_USER
                to = email
                html_content = HTML_EMAIL_CODE_MSG.format(code=code)
                msg = EmailMultiAlternatives(subject=subject, from_email=from_email, to=[to])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                return JsonResponse({'status': 200, 'code': code, 'email': user.email})
            return JsonResponse({'status': 403, 'message': 'wrong credentials'})
    context = {
        'title': 'Tasko sign-in'
    }
    return render(request, 'user/sign-in.html', context)


def sign_up(request):
    context = {
        'title': 'Tasko sign-up'
    }
    return render(request, 'user/sign-up.html', context)


def check_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        if username:
            if User.objects.filter(username=username).exists():
                return JsonResponse({'status': 409, 'message': 'user with such username already exists'})
    return JsonResponse({'status': 200, 'message': 'no user with such username'})
