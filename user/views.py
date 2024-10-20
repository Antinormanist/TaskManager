from random import randint, sample
from string import printable

from django.http import JsonResponse
from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.core.cache import cache

from .models import User
from .utils import HTML_EMAIL_CODE_MSG, get_client_ip, HTML_EMAIL_REG_CODE_MSG, HTML_PASSWORD_RESET_CODE_MSG
from .tasks import send_email
from .forms import UserRegistrationForm

# Create your views here.
REDIS_IP = 'user_ip-{id}'
REDIS_EMAIL_SUBMIT = 'user_email_submit-{id}'

def sign_in(request):
    if request.user.is_authenticated:
        return redirect(reverse('main:main'))
    if request.method == 'POST':
        data = request.POST.copy()
        if data.get('success'):
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                if cache.get(REDIS_EMAIL_SUBMIT.format(id=user.id)) is None:
                    # CHANGE IT TO 3600 * 24 * 30
                    cache.set(REDIS_EMAIL_SUBMIT.format(id=user.id), 'confirmed', timeout=3600 * 24 * 30)
                if cache.get(REDIS_IP.format(id=user.id)) != get_client_ip(request):
                    cache.set(REDIS_IP.format(id=user.id), get_client_ip(request), timeout=3600 * 24 * 90)
                login(request, user)
                #   CHANGE TO NORMAL REVERSE URL
                return JsonResponse({'status': 200, 'successUrl': reverse('main:main')})
        else:
            if not User.objects.filter(username=data.get('username')).exists():
                return JsonResponse({'status': 404, 'message': 'no user with such username'})
            user = authenticate(username=data.get('username'), password=data.get('password'))
            if user:
                if cache.get(REDIS_IP.format(id=user.id)) == get_client_ip(request) and cache.get(REDIS_EMAIL_SUBMIT.format(id=user.id)):
                    login(request, user)
                    #   CHANGE TO NORMAL REVERSE URL
                    return JsonResponse({'status': 200, 'trust': 1, 'successUrl': reverse('main:main')})
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
    if request.user.is_authenticated:
        return redirect(reverse('main:main'))
    if request.method == 'POST':
        if request.POST.get('sendEmail'):
            code = randint(1000, 9999)
            email = request.POST.get('email')
            username = request.POST.get('username')
            subject = "Tasko registration"
            from_email = settings.EMAIL_HOST_USER
            to_email = email
            html_content = HTML_EMAIL_REG_CODE_MSG.format(username=username, code=code)
            send_email.delay_on_commit(subject, from_email, to_email, html_content)
            return JsonResponse({'status': 200, 'code': code})
        elif request.POST.get('success'):
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')
            form = UserRegistrationForm({'username': username, 'email': email, 'password1': password, 'password2': password})
            print(form)
            if form.is_valid():
                user = form.save()
                login(request, user)
                cache.set(REDIS_EMAIL_SUBMIT.format(id=user.id), 'confirmed', timeout=3600 * 24 * 30)
                cache.set(REDIS_IP.format(id=user.id), get_client_ip(request), timeout=3600 * 24 * 90)
                return JsonResponse({'status': 201, 'successUrl': reverse('main:main')})

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


def logout_acc(request):
    logout(request)
    return JsonResponse({'status': 200, 'url': reverse('user:sign-in')})


def password_reset(request):
    if request.method == 'POST':
        if request.POST.get('check_user'):
            username = request.POST.get('username')
            user = User.objects.filter(username=username).first()
            if user:
                code = randint(1000, 9999)
                subject = "Tasko registration"
                from_email = settings.EMAIL_HOST_USER
                to_email = user.email
                html_content = HTML_PASSWORD_RESET_CODE_MSG.format(username=username, code=code)
                send_email.delay_on_commit(subject, from_email, to_email, html_content)
                return JsonResponse({'status': 200, 'code': code, 'email': user.email})
            else:
                return JsonResponse({'status': 404, 'message': 'user with such username doesn\'t exist'})
        elif request.POST.get('startReset'):
            secret_key = ''.join(sample(printable, 32))
            return JsonResponse({'status': 200, 'secret_key': secret_key})
        elif request.POST.get('reset'):
            if request.POST.get('secretKey'):
                username = request.POST.get('username')
                password = request.POST.get('password')
                user = User.objects.filter(username=username).first()
                user.set_password(password)
                user.save()
                login(request, user)
                return JsonResponse({'status': 200, 'successUrl': reverse('main:main')})
            else:
                return JsonResponse({'status': 403, 'message': 'nuh-uh'})
    context = {
        'title': 'Tasko reset'
    }
    return render(request, 'user/password-reset.html', context)