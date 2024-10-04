from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login
# Create your views here.
def sign_in(request):
    if request.method == 'POST':
        username, password = request.POST.get('username'), request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user:
            return redirect(reverse('user:sign-in-submit'))
    context = {
        'title': 'Tasko sign-in'
    }
    return render(request, 'user/sign-in.html', context)