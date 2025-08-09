from django.contrib import admin
# Import the models that actually exist in your models.py file
from .models import Course, Lesson, UserProgress

# Register your models here so you can manage them in the Django admin panel.
admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(UserProgress)
