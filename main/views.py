from datetime import date
import random

from django.shortcuts import render, redirect, reverse
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import login_required
import requests

from user.utils import get_client_ip
from user.tasks import send_email
from user.utils import HTML_EMAIL_CODE_MSG
from .models import Task
# Create your views here.
def welcome(request):
    if request.user.is_authenticated:
        return redirect(reverse('main:main'))
    context = {
        'title': 'Tasko Welcome'
    }
    return render(request, 'main/welcome.html', context)


@login_required
def main(request):
    if request.method == 'POST':
        if request.POST.get('changeLogin'):
            password = request.POST.get('password')
            new_login = request.POST.get('newLogin')
            user = authenticate(username=request.user.username, password=password)
            if user:
                user.username = new_login
                user.save()
                return JsonResponse({'status': 201, 'message': 'username was changed successfully'})
            return JsonResponse({'status': 403, 'message': 'wrong password'})
        elif request.POST.get('changeEmail'):
            password = request.POST.get('password')
            email = request.POST.get('email')
            user = authenticate(username=request.user.username, password=password)
            if user:
                code = random.randint(1000, 9999)
                subject = "Tasko authentication"
                from_email = settings.EMAIL_HOST_USER
                to_email = email
                html_content = HTML_EMAIL_CODE_MSG.format(username=user.username, code=code)
                send_email.delay_on_commit(subject, from_email, to_email, html_content)
                return JsonResponse({'status':200, 'code': code})
            return JsonResponse({'status': 403, 'message': 'wrong password'})
        elif request.POST.get('successEmail'):
            password = request.POST.get('password')
            email = request.POST.get('email')
            user = authenticate(username=request.user.username, password=password)
            if user:
                user.email = email
                user.save()
                return JsonResponse({'status': 200, 'message': 'email was changed successfully'})
            return JsonResponse({'status': 400, 'message': 'something went wrong'})
        elif request.POST.get('changeName'):
            name = request.POST.get('name')
            if name:
                request.user.firstname = name
                request.user.save()
                return JsonResponse({'status': 200, 'message': 'name was changed successfully'})
            return JsonResponse({'status': 400, 'message': 'something went wrong'})
        elif request.POST.get('sendAva'):
            avatar = request.FILES.get('image')
            if avatar:
                request.user.delete_avatar()
                request.user.avatar = avatar
                request.user.save()
                url = request.user.avatar.url
                return JsonResponse({'status': 200, 'message': 'avatar was changed successfully', 'url': url})
            return JsonResponse({'status': 400, 'message': 'something went wrong'})
        elif request.POST.get('deleteAccount'):
            password = request.POST.get('password')
            user = authenticate(username=request.user.username, password=password)
            if user:
                logout(request)
                user.delete()
                return JsonResponse({'status': 200, 'url': reverse('user:sign-in')})
            return JsonResponse({'status': 400, 'message': 'wrong password'})
        elif request.POST.get('createTask'):
            name = request.POST.get('name')
            description = request.POST.get('description')
            minutes = request.POST.get('minutes')
            priority = request.POST.get('priority')
            remind = request.POST.get('remind')
            if priority in ('common', 'simple', 'important', 'strong'):
                task = Task.objects.create(
                    name=name,
                    priority=priority,
                    user=request.user
                )
                if description:
                    task.description = description
                if minutes:
                    minutes = int(minutes)
                    task.minutes = minutes
                if remind != 'no':
                    month, day, year = map(int, remind.split('/'))
                    task.remind = date(year, month, day)
                task.save()
                return JsonResponse({'status': 201, 'id': task.id, 'message': 'task was successfully created'})
            return JsonResponse({'status': 400, 'message': 'priority is not valid'})

    ip = get_client_ip(request)
    data = requests.get(settings.WEATHER_API_LINK, params={'q': '63.116.61.253', 'key': settings.WEATHER_API_KEY}).json()

    tasks = Task.objects.filter(user=request.user).order_by('-created_at')
    is_there_completed_task = False
    for task in tasks:
        if task.is_completed:
            is_there_completed_task = True
            break
    context = {
        'title': 'Tasko Main',
        'w_data': data,
        'tasks': tasks,
        'is_there_completed_task': is_there_completed_task
    }
    if data.get('location'):
        context.update({'w_hours': int(data['location']['localtime'][-5:-3])})
    return render(request, 'main/main.html', context)