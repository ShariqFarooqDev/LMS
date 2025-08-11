from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .models import Course, Enrollment, Video, Quiz, Submission
from .serializers import (
    CourseSerializer, EnrollmentSerializer, VideoSerializer,
    QuizSerializer, SubmissionSerializer, RegisterSerializer, UserSerializer
)
from .permissions import IsOwnerOrReadOnly, IsEnrolled

# View for user registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # Anyone should be able to register
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    # Anyone can view courses, but only logged-in users can create them
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Assign the current user as the course owner
        serializer.save(owner=self.request.user)


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    # Only the owner can edit or delete the course
    permission_classes = [IsOwnerOrReadOnly]


class EnrollmentCreateView(generics.CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    # Must be logged in to enroll
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Assign the current user to the enrollment
        serializer.save(user=self.request.user)


class UserEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only the enrollments for the current user
        return Enrollment.objects.filter(user=self.request.user)


class VideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsEnrolled]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Video.objects.filter(course_id=course_id)


class QuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsEnrolled]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Quiz.objects.filter(course_id=course_id)


class SubmitQuizView(generics.CreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserProgressView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(user=self.request.user)
