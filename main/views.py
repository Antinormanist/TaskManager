from django.shortcuts import render, redirect, reverse
from django.conf import settings
import requests

import logging

logger = logging.getLogger(__name__)

from user.utils import get_client_ip

# Create your views here.
def welcome(request):
    if request.user.is_authenticated:
        return redirect(reverse('main:main'))
    context = {
        'title': 'Tasko Welcome'
    }
    return render(request, 'main/welcome.html', context)


def main(request):
    logger.info('Hello! It\'s an info message!!!')
    ip = get_client_ip(request)
    data = requests.get('http://api.weatherapi.com/v1/current.json', params={'q': '122.34.69.73', 'key': settings.WEATHER_API_KEY}).json()
    print(data)
    # TO GET INFO ABOUT WEATHER
    context = {
        'title': 'Tasko Main',
        'w_data': data,
        'w_hours': int(data['location']['localtime'][-5:-3])
    }
    return render(request, 'main/main.html', context)