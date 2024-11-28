import datetime
import random
import logging

from django.shortcuts import render, redirect, reverse
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import login_required
import requests

from user.utils import get_client_ip
from user.tasks import send_email
from user.utils import HTML_EMAIL_CODE_MSG
from .models import Task, Notification
from .utils import priority_sort, TASK_DATE_MESSAGE

log = logging.getLogger(__name__)
logging.basicConfig(filename='gyat.log', level=logging.INFO)
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
                if request.user.firstname:
                    return JsonResponse({'status': 201, 'message': 'username was changed successfully', 'firstname': 1})
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
                    task.remind = datetime.date(year, month, day)
                task.save()
                if task.remind:
                    Notification.objects.create(
                        task=task
                    )
                return JsonResponse({'status': 201, 'id': task.id, 'message': 'task was successfully created'})
            return JsonResponse({'status': 400, 'message': 'priority is not valid'})
        elif request.POST.get('deleteTask'):
            id = request.POST.get('id')
            if isinstance(id, int) or (isinstance(id, str) and id.isdigit()):
                id = int(id)
                task = Task.objects.filter(id=id).first()
                if task:
                    task.delete()
                    return JsonResponse({'status': 204, 'message': 'task was successfully deleted'})
                return JsonResponse({'status': 404, 'message': 'no task with such id'})
            return JsonResponse({'status': 400, 'message': 'id is not valid'})
        elif request.POST.get('completeTask'):
            if id := request.POST.get('id'):
                id = int(id)
                task = Task.objects.filter(id=id).first()
                if task:
                    if task.user == request.user:
                        task.is_completed = True;
                        task.save()
                        return JsonResponse({'status': 200, 'message': 'task was completed successfully'})
                    return JsonResponse({'status': 403, 'message': 'task with such id is not your task'})
            return JsonResponse({'status': 400, 'message': 'could\'t get id'})
        elif request.POST.get('sendMessageDate'):
            day = int(request.POST.get('day'))
            month = int(request.POST.get('month'))
            year = int(request.POST.get('year'))

            date = datetime.date(year, month, day)
            notifications = Notification.objects.filter(task__remind=date)
            for notification in notifications:
                user = notification.task.user
                username = user.username
                email = user.email
                title = notification.task.name
                subject = "Tasko task notification"
                from_email = settings.EMAIL_HOST_USER
                to_email = email
                html_content = TASK_DATE_MESSAGE.format(username=username, task_title=title)
                send_email.delay_on_commit(subject, from_email, to_email, html_content)
            return JsonResponse({'message': 'who will be reading this?'})

    ip = get_client_ip(request)
    data = requests.get(settings.WEATHER_API_LINK, params={'q': '63.116.61.253', 'key': settings.WEATHER_API_KEY}).json()
    all_tasks = Task.objects.filter(user=request.user)
    tasks = []
    completed_tasks = []
    templated_tasks = []
    spec_tasks = []
    if fltr := request.GET.get('filter'):
        if fltr == 'di':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    if task.remind:
                        spec_tasks.append(task)
                    else:
                        tasks.append(task)
                elif task.is_completed:
                    completed_tasks.add(task)
                else:
                    templated_tasks.add(task)
            spec_tasks.sort(key=lambda x: x.remind)
        elif fltr == 'pi':
            tasks = sorted(all_tasks, key=priority_sort)
        elif fltr == 'ti':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    if task.minutes:
                        spec_tasks.append(task)
                    else:
                        tasks.append(task)
                elif task.is_completed:
                    completed_tasks.add(task)
                else:
                    templated_tasks.add(task)
            spec_tasks.sort(key=lambda x: x.minutes)
        elif fltr == 'dd':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    if task.remind:
                        spec_tasks.append(task)
                    else:
                        tasks.append(task)
                elif task.is_completed:
                    completed_tasks.add(task)
                else:
                    templated_tasks.add(task)
            spec_tasks.sort(key=lambda x: x.remind, reverse=True)
        elif fltr == 'pd':
            tasks = sorted(all_tasks, key=priority_sort, reverse=True)
        elif fltr == 'td':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    if task.minutes:
                        spec_tasks.append(task)
                    else:
                        tasks.append(task)
                elif task.is_completed:
                    completed_tasks.add(task)
                else:
                    templated_tasks.add(task)
            spec_tasks.sort(key=lambda x: x.minutes, reverse=True)
    else:
        for task in all_tasks:
            if task.is_completed:
                completed_tasks.append(task)
            elif task.is_templated:
                templated_tasks.append(task)
            else:
                tasks.append(task)
    tasks.sort(key=lambda x: x.created_at, reverse=True)
    is_there_completed_task = False
    if completed_tasks:
        is_there_completed_task = True
    context = {
        'title': 'Tasko Main',
        'w_data': data,
        'special_tasks': spec_tasks,
        'tasks': tasks,
        'completed_tasks': completed_tasks,
        'templated_tasks': templated_tasks,
        'is_there_completed_task': is_there_completed_task
    }
    if data.get('location'):
        context.update({'w_hours': int(data['location']['localtime'][-5:-3])})
    return render(request, 'main/main.html', context)