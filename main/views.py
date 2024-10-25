from django.shortcuts import render, redirect, reverse
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
import requests

from user.utils import get_client_ip

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
            return JsonResponse({'status': 403, 'message': 'password is not valid'})
    ip = get_client_ip(request)
    data = requests.get(settings.WEATHER_API_LINK, params={'q': '63.116.61.253', 'key': settings.WEATHER_API_KEY}).json()
    context = {
        'title': 'Tasko Main',
        'w_data': data,
    }
    if data.get('location'):
        context.update({'w_hours': int(data['location']['localtime'][-5:-3])})
    return render(request, 'main/main.html', context)