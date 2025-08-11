from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import Course, Enrollment, Video, Quiz, Submission
from .serializers import (
    CourseSerializer, EnrollmentSerializer, VideoSerializer,
    QuizDetailSerializer, SubmissionSerializer, RegisterSerializer, UserSerializer
)
from .permissions import IsOwnerOrReadOnly, IsEnrolled

# --- Existing Views (some with minor updates) ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsOwnerOrReadOnly]

class EnrollmentCreateView(generics.CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

class VideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsEnrolled]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Video.objects.filter(course_id=course_id)

class UserProgressView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(user=self.request.user)

# --- New and Updated Views for Quizzes ---

# New View to get details for a single quiz (questions and choices)
class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolled]

# Updated View to handle quiz submissions
class SubmitQuizView(generics.CreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolled]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        quiz_id = self.kwargs['quiz_id']
        context['quiz'] = get_object_or_404(Quiz, id=quiz_id)
        return context
