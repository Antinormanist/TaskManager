from django.urls import path

from . import views

app_name = 'user'

urlpatterns = [
    path('sign-in/', views.sign_in, name='sign-in'),
    path('sign-up/', views.sign_up, name='sign-up'),
    path('check-user/', views.check_user, name='check-user'),
    path('logout/', views.logout_acc, name='logout'),
    path('password-reset/', views.password_reset, name='password_reset')
]