from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
# Create your models here.


class Profile(models.Model):
    USER_TYPES = (
        ('admin', 'admin'),
        ('employee', 'employee'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_user')
    reset_password_token = models.CharField(max_length=50, default="", blank=True)
    reset_password_expire = models.DateTimeField(null=True, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='employee')

@receiver(post_save, sender=User)
def save_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile(user=instance)
        if instance.is_superuser:
            profile.user_type = 'admin'
        profile.save()