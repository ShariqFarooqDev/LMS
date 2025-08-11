from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView,
    CourseListCreateView, CourseDetailView,
    EnrollmentCreateView, UserEnrollmentsView,
    VideoListView,
    QuizDetailView, # Import new view
    SubmitQuizView, UserProgressView
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Courses
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Enrollments
    path('enroll/', EnrollmentCreateView.as_view(), name='enrollment-create'),
    path('my-enrollments/', UserEnrollmentsView.as_view(), name='user-enrollments'),

    # Content
    path('courses/<int:course_id>/videos/', VideoListView.as_view(), name='video-list'),
    
    # Quizzes
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'), # New URL for quiz details
    path('quizzes/<int:quiz_id>/submit/', SubmitQuizView.as_view(), name='submit-quiz'),

    # Progress
    path('my-progress/', UserProgressView.as_view(), name='user-progress'),
]
