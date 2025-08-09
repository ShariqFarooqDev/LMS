from django.db import models
from django.conf import settings

# --- Keep your existing Course and Lesson models ---

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses_taught')
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='courses_enrolled', blank=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


# --- Add the new UserProgress model below ---

class UserProgress(models.Model):
    """
    Tracks the progress of a user in a specific course.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    completed_lessons = models.ManyToManyField(Lesson, blank=True)

    class Meta:
        # Ensures a user can only have one progress tracker per course
        unique_together = ('user', 'course')

    def __str__(self):
        return f"Progress for {self.user.username} in {self.course.title}"

