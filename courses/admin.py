from django.contrib import admin
# Import all the models you want to see in the admin panel
from .models import Course, Lesson, UserProgress, Quiz, Question, Answer, QuizAttempt

# Register your models here.
admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(UserProgress)

# Add these lines to register the new quiz models
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(QuizAttempt)
