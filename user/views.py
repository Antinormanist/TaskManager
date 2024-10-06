from random import randint

from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.core.cache import cache

from .models import User
from .utils import HTML_EMAIL_CODE_MSG, get_client_ip
from .tasks import send_email

# Create your views here.
REDIS_IP = 'user_ip-{id}'
REDIS_EMAIL_SUBMIT = 'user_email_submit-{id}'

def sign_in(request):
    if request.method == 'POST':
        data = request.POST.copy()
        if data.get('success'):
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                if cache.get(REDIS_EMAIL_SUBMIT.format(id=user.id)) is None:
                    # CHANGE IT TO 3600 * 24 * 30
                    cache.set(REDIS_EMAIL_SUBMIT.format(id=user.id), 'confirmed', timeout=60)
                if cache.get(REDIS_IP.format(id=user.id)) != get_client_ip(request):
                    cache.set(REDIS_IP.format(id=user.id), get_client_ip(request), timeout=3600 * 24 * 90)
                login(request, user)
                #   CHANGE TO NORMAL REVERSE URL
                return JsonResponse({'status': 200, 'successUrl': 'https://google.com'})
        else:
            if not User.objects.filter(username=data.get('username')).exists():
                return JsonResponse({'status': 404, 'message': 'no user with such username'})
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                if cache.get(REDIS_IP.format(id=user.id)) == get_client_ip(request) and cache.get(REDIS_EMAIL_SUBMIT.format(id=user.id)):
                    login(request, user)
                    #   CHANGE TO NORMAL REVERSE URL
                    return JsonResponse({'status': 200, 'trust': 1, 'successUrl': 'https://google.com'})
                code = randint(1000, 9999)
                email = user.email
                subject = "Tasko authentication"
                from_email = settings.EMAIL_HOST_USER
                to_email = email
                html_content = HTML_EMAIL_CODE_MSG.format(username=user.username, code=code)
                send_email.delay_on_commit(subject, from_email, to_email, html_content)
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
    # SAVE USER'S IP IN REDIS AND HIS REG TIME. AFTER 30 DAYS USER MUST WRITE CODE FROM EMAIL
    return render(request, 'user/sign-up.html', context)


def check_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        if username:
            if User.objects.filter(username=username).exists():
                return JsonResponse({'status': 409, 'message': 'user with such username already exists'})
    return JsonResponse({'status': 200, 'message': 'no user with such username'})
