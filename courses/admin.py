from django.contrib import admin
from .models import Course, Video, Quiz, Progress


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)
    ordering = ('-created_at',)


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    search_fields = ('title',)
    ordering = ('course', 'order')


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('course', 'question')
    list_filter = ('course',)
    search_fields = ('question',)


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'score')
    list_filter = ('course', 'user')
    search_fields = ('user__username', 'course__title')
