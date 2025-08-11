from django.urls import path
# Import views for handling JWT tokens
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    # Import our new registration view
    RegisterView,
    CourseListCreateView, CourseDetailView,
    EnrollmentCreateView, UserEnrollmentsView,
    VideoListView, QuizListView,
    SubmitQuizView, UserProgressView
)

urlpatterns = [
    # Authentication URLs
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Course URLs
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Enrollment URLs
    path('enroll/', EnrollmentCreateView.as_view(), name='enrollment-create'),
    path('my-enrollments/', UserEnrollmentsView.as_view(), name='user-enrollments'),

    # Content URLs
    path('courses/<int:course_id>/videos/', VideoListView.as_view(), name='video-list'),
    path('courses/<int:course_id>/quizzes/', QuizListView.as_view(), name='quiz-list'),

    # Submission and Progress URLs
    path('quizzes/<int:quiz_id>/submit/', SubmitQuizView.as_view(), name='submit-quiz'),
    path('my-progress/', UserProgressView.as_view(), name='user-progress'),
]
