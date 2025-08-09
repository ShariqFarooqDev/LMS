# Keep all your existing imports
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny # Import AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User # Import User model
from django.contrib.auth import authenticate # Import authenticate
from rest_framework.authtoken.models import Token # Import Token model

# Keep all your existing model and serializer imports, and add UserSerializer
from .models import (
    Course, Lesson, UserProgress,
    Quiz, Question, Answer, QuizAttempt
)
from .serializers import (
    CourseSerializer, LessonSerializer, UserProgressSerializer,
    QuizSerializer, QuizSubmissionSerializer, QuizAttemptSerializer,
    UserSerializer # Make sure UserSerializer is imported
)
from .permissions import IsInstructorOrReadOnly

# --- Add the new Registration and Login views below ---

class RegisterView(APIView):
    """
    View for user registration.
    """
    permission_classes = [AllowAny] # Anyone should be able to register

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response(
                {'error': 'Username, password, and email are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already taken.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username, password=password, email=email)
        token, created = Token.objects.get_or_create(user=user)

        return Response({'token': token.key}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    View for user login. Returns an auth token.
    """
    permission_classes = [AllowAny] # Anyone can attempt to log in

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response(
                {'error': 'Invalid Credentials'},
                status=status.HTTP_400_BAD_REQUEST
            )


# --- Keep all your existing ViewSets and Views below ---

class CourseViewSet(viewsets.ModelViewSet):
    # ... (no changes needed here)
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
    # ... (no changes needed here)
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            enrolled_courses = Course.objects.filter(students=self.request.user)
            return Lesson.objects.filter(course__in=enrolled_courses)
        return Lesson.objects.none()


class MarkLessonCompleteView(APIView):
    # ... (no changes needed here)
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
    # ... (no changes needed here)
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        progress = get_object_or_404(UserProgress, user=request.user, course=course)
        serializer = UserProgressSerializer(progress)
        return Response(serializer.data)


class QuizViewSet(viewsets.ModelViewSet):
    # ... (no changes needed here)
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
