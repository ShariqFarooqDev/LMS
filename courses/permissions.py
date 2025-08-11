from rest_framework import permissions
from .models import Enrollment, Quiz

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class IsEnrolled(permissions.BasePermission):
    """
    Custom permission to only allow users enrolled in a course to view its content.
    This permission is more robust and checks the object being accessed to find
    the parent course.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Determine the course ID based on the URL kwargs
        course_id = view.kwargs.get('course_id')
        quiz_id = view.kwargs.get('pk') or view.kwargs.get('quiz_id')

        if course_id:
            # If course_id is directly in the URL, check enrollment for that course
            return Enrollment.objects.filter(user=request.user, course_id=course_id).exists()
        
        elif quiz_id:
            # If it's a quiz URL, find the quiz's course and check enrollment
            try:
                quiz = Quiz.objects.select_related('course').get(id=quiz_id)
                return Enrollment.objects.filter(user=request.user, course=quiz.course).exists()
            except Quiz.DoesNotExist:
                return False # Quiz not found, deny permission

        # Deny permission if we can't determine the course
        return False
