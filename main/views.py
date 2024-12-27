import datetime
import random
import logging
import json

from django.shortcuts import render, redirect, reverse
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import authenticate, logout
from django.contrib.auth.decorators import login_required
from decouple import config
import requests
import redis

from user.utils import get_client_ip
from user.tasks import send_email
from user.utils import HTML_EMAIL_CODE_MSG
from .models import Task, Notification, Comment, Template
from .utils import priority_sort

log = logging.getLogger(__name__)
logging.basicConfig(filename='gyat.log', level=logging.INFO)

redis = redis.Redis(host=config('REDIS_HOST'), port=config('REDIS_PORT', cast=int), db=config('REDIS_KEYS_DB', cast=int, default=0), decode_responses=True)

MONTHS_STRING = {
    1: 'Январь',
    2: 'Февраль',
    3: 'Март',
    4: 'Апрель',
    5: 'Май',
    6: 'Июнь',
    7: 'Июль',
    8: 'Август',
    9: 'Сентябрь',
    10: 'Октрябрь',
    11: 'Ноябрь',
    12: 'Декабрь',
}

REDIS_NOTIFI = 'redis-notifi-{id}'
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
            return JsonResponse({'status': 400, 'message': 'couldn\'t get id'})
        elif request.POST.get('returnTask'):
            if id := request.POST.get('id'):
                id = int(id)
                task = Task.objects.filter(id=id).first()
                if task:
                    if task.user == request.user:
                        task.is_completed = False;
                        task.save()
                        return JsonResponse({'status': 200, 'message': 'task was returned successfully'})
                    return JsonResponse({'status': 403, 'message': 'task with such id is not your task'})
            return JsonResponse({'status': 400, 'message': 'couldn\t get id'})
        elif request.POST.get('delAllDoneTasks'):
            ids = request.POST.get('ids')
            if ids:
                ids = json.loads(ids).keys()
                for id in ids:
                    id = int(id)
                    task = Task.objects.filter(id=id).first()
                    if task and task.user == request.user:
                        task.delete()
                return JsonResponse({'status': 204})
            return JsonResponse({'status': 400, 'message': 'no ids were given'})
        elif request.POST.get('getTaskInfo'):
            id = request.POST.get('id')
            if id:
                id = int(id)
                task = Task.objects.filter(id=id)
                if task.first():
                    task = task.first()
                    time = task.minutes
                    priority = task.priority
                    return JsonResponse({'status': 200, 'time': time, 'priority': priority})
                return JsonResponse({'status': 400, 'message': 'couldn\'t get task'})
            return JsonResponse({'status': 400, 'message': 'couldn\'t get id'})
        elif request.POST.get('getInfoForTaskFrame'):
            if id := request.POST.get('id'):
                id = int(id)
                task = Task.objects.filter(id=id).first()
                if task:
                    remind = ''
                    if task.remind:
                        day, month, year = task.remind.day, task.remind.month, task.remind.year
                        remind = f'{day}|{month}|{year}'

                    comments = []
                    for t in Comment.objects.filter(task__id=task.id):
                        a = {}
                        a['day'] = t.data.day
                        a['month'] = t.data.month
                        a['year'] = t.data.year

                        a['id'] = t.id
                        # THERE IS A PROBLEM WITH THAT FUCKING AVATAR
                        if t.user and t.user.avatar:
                            a['userImage'] = t.user.avatar.url
                        if t.user:
                            a['username'] = t.user.username
                        a['comment'] = t.comment

                        comments.append(a)
                    # json comments
                    comments = json.dumps(comments)
                    return JsonResponse({'status': 200, 'name': task.name, 'description': task.description, 'priority': task.priority, 'remind': remind, 'comments': comments})
                return JsonResponse({'status': 400, 'message': 'couldn\'t get task'})
            return JsonResponse({'status': 400, 'message': 'couldn\'t get id'})
        elif request.POST.get('taskInfoChange'):
            if id := request.POST.get('id'):
                id = int(id)
                name = request.POST.get('name')
                description = request.POST.get('description')
                priority = request.POST.get('priority')
                remind = request.POST.get('remind') # mm/dd/yyyy
                task = Task.objects.filter(id=id).first()
                if task:
                    if name:
                        task.name = name
                    if description:
                        task.description = description
                    if priority in ('common', 'simple', 'important', 'strong'):
                        task.priority = priority
                    if remind:
                        remind = remind.split('|')
                        if len(remind) == 3:
                            month, day, year = map(int, remind)
                            date = datetime(year. month, day)
                            task.remind = date
                    task.save()
                    return JsonResponse({'status': 200, 'message': 'task was successfully changed'})
                return JsonResponse({'status': 400, 'message': 'couldn\t get task'})
            return JsonResponse({'status': 400, 'message': 'couldn\t get id'})
        elif request.POST.get('createComment'):
            if id := request.POST.get('id'):
                id = int(id)
                task = Task.objects.filter(id=id).first()
                if task:
                    comment = request.POST.get('comment')
                    com = Comment.objects.create(
                        user=request.user,
                        task=task,
                        comment=comment,
                    )
                    date = com.data
                    a = {}
                    day, month, year = date.day, date.month, date.year
                    a['day'] = day
                    a['month'] = month,
                    a['year'] = year
                    a['id'] = com.id
                    a['username'] = request.user.username
                    if request.user.avatar:
                        a['img'] = request.user.avatar.url
                    return JsonResponse({'status': 201, 'info': json.dumps(a)})
                    # return JsonResponse({'status': 201, 'id': com.id, 'day': day, 'month': month, 'year': year, 'img': request.user.avatar.url, 'username': request.user.username})
                return JsonResponse({'status': 400, 'message': 'couldn\t get task with such id'})
            return JsonResponse({'status': 400, 'message': 'couldn\t get id'})
        elif request.POST.get('deleteCommentO'):
            if id := request.POST.get('id'):
                id = int(id)
                comm = Comment.objects.filter(id=id).first()
                if comm:
                    if comm.user == request.user:
                        comm.delete()
                        return JsonResponse({'status': 204, 'message': 'comment was successfully deleted'})
                    return JsonResponse({'status': 403, 'message': 'comment with such id is not your comment'})
                return JsonResponse({'status': 400, 'message': 'couldn\t get comment with such id'})
            return JsonResponse({'status': 400, 'message': 'couldn\t get id'})
        elif request.POST.get('changeCommentO'):
            if id := request.POST.get('id'):
                id = int(id)
                comment = Comment.objects.filter(id=id).first()
                if comment:
                    if comment.user == request.user:
                        text = request.POST.get('text')
                        comment.comment = text
                        comment.save()
                        return JsonResponse({'status': 200, 'message': 'comment was successfully changed'})
                    return JsonResponse({'status': 403, 'message': 'comment with such id is not your comment'})
                return JsonResponse({'status': 400, 'message': 'couldn\t get comment with such id'})
            return JsonResponse({'status': 400, 'message': 'couldn\t get id'})
        elif request.POST.get('createTemplate'):
            name = request.POST.get('name')
            description = request.POST.get('description')
            temp = Template.objects.create(
                name=name,
                description=description,
                user=request.user
            )
            return JsonResponse({'status': 201, 'id': temp.id, 'message': 'template was created successfully'})
        elif request.POST.get('CreateTemplateTask'):
            if template_id := request.POST.get('templateId'):
                template_id = int(template_id)
                if name := request.POST.get('name'):
                    template = Template.objects.filter(id=template_id).first()
                    if template:
                        if template.user == request.user:
                            description = request.POST.get('description')
                            priority = request.POST.get('priority')
                            day, month, year = request.POST.get('day'), request.POST.get('month'), request.POST.get('year')
                            minutes = request.POST.get('minutes')
                            task = Task.objects.create(
                                is_templated=True,
                                template=template,
                                name=name,
                                priority=priority,
                                user=request.user
                            )
                            if description:
                                task.description = description
                            if minutes and minutes.isdigit():
                                task.minutes = int(minutes)
                            if day and month and year and day.isdigit() and month.isdigit() and year.isdigit():
                                task.remind = datetime.date(year, month, day)
                            task.save()

                            return JsonResponse({'status': 201, 'message': 'task was created successfully'})
                        return JsonResponse({'status': 403, 'message': 'template with such id is not current user\'s template'})
                    return JsonResponse({'status': 400, 'message': 'couldn\t get template with such id'})
                return JsonResponse({'status': 400, 'message': 'couldn\t get task\'s name'})
            return JsonResponse({'status': 400, 'message': 'couldn\t get template\'s id'})

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
                    completed_tasks.append(task)
                else:
                    templated_tasks.append(task)
            spec_tasks.sort(key=lambda x: x.remind)
        elif fltr == 'pi':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    tasks.append(task)
                elif task.is_completed:
                    completed_tasks.append(task)
                else:
                    templated_tasks.append(task)
            tasks = sorted(all_tasks, key=priority_sort)
        elif fltr == 'ti':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    if task.minutes:
                        spec_tasks.append(task)
                    else:
                        tasks.append(task)
                elif task.is_completed:
                    completed_tasks.append(task)
                else:
                    templated_tasks.append(task)
            spec_tasks.sort(key=lambda x: x.minutes)
        elif fltr == 'dd':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    if task.remind:
                        spec_tasks.append(task)
                    else:
                        tasks.append(task)
                elif task.is_completed:
                    completed_tasks.append(task)
                else:
                    templated_tasks.append(task)
            spec_tasks.sort(key=lambda x: x.remind, reverse=True)
        elif fltr == 'pd':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    tasks.append(task)
                elif task.is_completed:
                    completed_tasks.append(task)
                else:
                    templated_tasks.append(task)
            tasks = sorted(all_tasks, key=priority_sort, reverse=True)
        elif fltr == 'td':
            for task in all_tasks:
                if not (task.is_completed or task.is_templated):
                    if task.minutes:
                        spec_tasks.append(task)
                    else:
                        tasks.append(task)
                elif task.is_completed:
                    completed_tasks.append(task)
                else:
                    templated_tasks.append(task)
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
        'is_there_completed_task': is_there_completed_task,
    }
    if data.get('location'):
        context.update({'w_hours': int(data['location']['localtime'][-5:-3])})
    return render(request, 'main/main.html', context)


def error_404_page(request, exception):
    log.info(request.path)
    context = {
        'title': 'error',
        'main_url': reverse('main:main')
    }
    return render(request, 'main/404.html', context)