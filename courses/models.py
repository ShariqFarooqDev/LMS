from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Video(models.Model):
    course = models.ForeignKey(Course, related_name="videos", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    video_url = models.URLField()
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Quiz(models.Model):
    course = models.ForeignKey(Course, related_name="quizzes", on_delete=models.CASCADE)
    question = models.CharField(max_length=300)
    answer = models.CharField(max_length=200)

    def __str__(self):
        return f"Quiz for {self.course.title}"


class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    completed_videos = models.ManyToManyField(Video, blank=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.course.title} Progress"
