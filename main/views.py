from django.shortcuts import render

# Create your views here.
def welcome(request):
    context = {
        'title': 'Tasko Welcome'
    }
    return render(request, 'main/welcome.html', context)