import os

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=64, unique=True)
    email = models.EmailField(max_length=255)
    firstname = models.CharField(max_length=64, null=True)
    avatar = models.ImageField(upload_to='profile/avatars/', null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def delete_avatar(self):
        if self.avatar:
            avatar_path = self.avatar.path

            if os.path.isfile(avatar_path):
                os.remove(avatar_path)

            self.avatar = None
            self.save()

    class Meta:
        db_table = 'users'