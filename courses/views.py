# Keep your existing imports
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

# Keep your existing model and serializer imports, and add the new ones
from .models import (
    Course, Lesson, UserProgress,
    Quiz, Question, Answer, QuizAttempt
)
from .serializers import (
    CourseSerializer, LessonSerializer, UserProgressSerializer,
    QuizSerializer, QuizSubmissionSerializer, QuizAttemptSerializer
)
from .permissions import IsInstructorOrReadOnly

# --- Keep your existing ViewSets and Views ---

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        if request.user in course.students.all():
            return Response({'status': 'already enrolled'}, status=status.HTTP_400_BAD_REQUEST)
        course.students.add(request.user)
        return Response({'status': 'enrolled'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unenroll(self, request, pk=None):
        course = self.get_object()
        if request.user not in course.students.all():
            return Response({'status': 'not enrolled'}, status=status.HTTP_400_BAD_REQUEST)
        course.students.remove(request.user)
        return Response({'status': 'unenrolled'})


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            enrolled_courses = Course.objects.filter(students=self.request.user)
            return Lesson.objects.filter(course__in=enrolled_courses)
        return Lesson.objects.none()


class MarkLessonCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id)
        course = lesson.course
        if request.user not in course.students.all():
            return Response(
                {"error": "You are not enrolled in this course."},
                status=status.HTTP_403_FORBIDDEN
            )
        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            course=course
        )
        progress.completed_lessons.add(lesson)
        return Response(
            {"status": f"Lesson '{lesson.title}' marked as complete."},
            status=status.HTTP_200_OK
        )


class UserProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        progress = get_object_or_404(UserProgress, user=request.user, course=course)
        serializer = UserProgressSerializer(progress)
        return Response(serializer.data)


# --- Add the new QuizViewSet below ---

class QuizViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, and submitting quizzes.
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        # Only show quizzes for courses the user is enrolled in
        if self.request.user.is_authenticated:
            enrolled_courses = Course.objects.filter(students=self.request.user)
            return Quiz.objects.filter(course__in=enrolled_courses)
        return Quiz.objects.none()

    @action(detail=True, methods=['post'], serializer_class=QuizSubmissionSerializer, permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        """
        Action to submit answers for a quiz and get the score.
        """
        quiz = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submitted_answers = serializer.validated_data['answers']

        correct_answers = 0
        total_questions = quiz.questions.count()

        # Loop through the submitted answers and check if they are correct
        for question_id, answer_id in submitted_answers.items():
            try:
                # Ensure we are dealing with integers
                question_id = int(question_id)
                answer_id = int(answer_id)
                
                correct_answer = Answer.objects.get(question_id=question_id, is_correct=True)
                if correct_answer.id == answer_id:
                    correct_answers += 1
            except (Answer.DoesNotExist, ValueError):
                # Handle cases where a correct answer isn't defined or ID is invalid
                continue
        
        # Calculate the score as a percentage
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

        # Save the attempt to the database
        attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz, score=score)

        # Return the result to the user
        result_serializer = QuizAttemptSerializer(attempt)
        return Response(result_serializer.data, status=status.HTTP_200_OK)

