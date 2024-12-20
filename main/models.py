from django.db import models

from user.models import User

# Create your models here.
Priority_choice = (
    ('common', 'common'),
    ('simple', 'simple'),
    ('important', 'important'),
    ('strong', 'strong')
)

class Task(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=256, null=True)
    minutes = models.PositiveIntegerField(null=True)
    priority = models.CharField(choices=Priority_choice, max_length=9, default='common')
    remind = models.DateField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    template = models.ForeignKey(to='Template', on_delete=models.CASCADE, null=True)
    is_templated = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    class Meta:
        db_table = 'tasks'


class Template(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=256, null=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'templates'


class Notification(models.Model):
    task = models.ForeignKey(to=Task, on_delete=models.CASCADE)

    class Meta:
        db_table = 'notifications'


class Comment(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.SET_NULL, null=True)
    task = models.ForeignKey(to=Task, on_delete=models.CASCADE, null=True)
    comment = models.CharField(max_length=357)
    data = models.DateField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comments'