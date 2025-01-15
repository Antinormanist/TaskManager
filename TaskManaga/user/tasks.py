from celery import shared_task
from django.core.mail import EmailMultiAlternatives

@shared_task
def send_email(subject, from_email, to, html_content):
    msg = EmailMultiAlternatives(subject=subject, from_email=from_email, to=[to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()