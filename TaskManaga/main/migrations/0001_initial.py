# Generated by Django 4.2.16 on 2024-12-01 20:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('description', models.TextField(max_length=256, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'templates',
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('description', models.TextField(max_length=256, null=True)),
                ('minutes', models.PositiveIntegerField(null=True)),
                ('priority', models.CharField(choices=[('common', 'common'), ('simple', 'simple'), ('important', 'important'), ('strong', 'strong')], default='common', max_length=9)),
                ('remind', models.DateField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_templated', models.BooleanField(default=False)),
                ('is_completed', models.BooleanField(default=False)),
                ('template', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.template')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'tasks',
            },
        ),
        migrations.CreateModel(
            name='NotificationShow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_title', models.CharField(max_length=128)),
                ('day', models.SmallIntegerField(max_length=2)),
                ('month', models.CharField(max_length=32)),
                ('year', models.SmallIntegerField(max_length=4)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'notificationsshow',
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.task')),
            ],
            options={
                'db_table': 'notifications',
            },
        ),
    ]