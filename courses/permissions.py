from rest_framework import permissions
from .models import Enrollment

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request,
        # so we'll always allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.owner == request.user


class IsEnrolled(permissions.BasePermission):
    """
    Custom permission to only allow users enrolled in a course to view its content.
    """

    def has_permission(self, request, view):
        # First, ensure the user is authenticated.
        if not request.user or not request.user.is_authenticated:
            return False

        # Get the course_id from the URL kwargs.
        # This is expected to be provided by the URL pattern.
        course_id = view.kwargs.get('course_id')
        if not course_id:
            # If there's no course_id in the URL, we cannot check for enrollment.
            # We deny permission as a security precaution.
            return False

        # Check if an active enrollment exists for the current user and the specific course.
        return Enrollment.objects.filter(user=request.user, course_id=course_id).exists()
