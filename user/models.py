from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=64)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    firstname = models.CharField(max_length=64, null=True)
    avatar = models.ImageField(upload_to='profile/avatars/', null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'