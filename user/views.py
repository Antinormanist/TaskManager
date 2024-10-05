from random import randint

from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login
from django.http import JsonResponse

from .forms import UserRegistration
from .models import User

# Create your views here.
def sign_in(request):
    if request.method == 'POST':
        data = request.POST.copy()
        if data.get('success'):
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                login(request, user)
                return JsonResponse({'successUrl': 'https://google.com'})
        elif data.get('send_message'):
            email = data.get('email')
        #     SEND MESSAGE TO THE EMAIL
            return JsonResponse({'status': 200, 'message': 'email is sent'})
        else:
            if not User.objects.filter(username=data.get('username')).exists():
                return JsonResponse({'status': 404, 'message': 'no user with such username'})
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                code = randint(1000, 9999)
                return JsonResponse({'status': 200, 'code': code, 'email': user.email})
            else:
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