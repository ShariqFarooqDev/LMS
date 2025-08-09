from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, VideoViewSet, QuizViewSet, ProgressViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'progress', ProgressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
