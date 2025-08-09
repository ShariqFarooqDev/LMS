from rest_framework import serializers
# Import all the necessary models
from .models import Course, Lesson, UserProgress, Quiz, Question, Answer, QuizAttempt
from django.contrib.auth.models import User

# --- Keep your existing UserSerializer, LessonSerializer, CourseSerializer, and UserProgressSerializer ---

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'content', 'order', 'course')

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    instructor = UserSerializer(read_only=True)
    students = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'instructor', 'students', 'lessons')

class UserProgressSerializer(serializers.ModelSerializer):
    completed_lessons = LessonSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = UserProgress
        fields = ('id', 'user', 'course', 'completed_lessons')


# --- Add the new Quiz serializers below ---

class AnswerSerializer(serializers.ModelSerializer):
    """Serializer for the Answer model."""
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for the Question model, with nested answers."""
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']


class QuizSerializer(serializers.ModelSerializer):
    """Serializer for the Quiz model, with nested questions."""
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'course', 'questions']


class QuizAttemptSerializer(serializers.ModelSerializer):
    """Serializer for recording and displaying quiz attempts."""
    user = UserSerializer(read_only=True)
    quiz = QuizSerializer(read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'user', 'quiz', 'score', 'timestamp']


class QuizSubmissionSerializer(serializers.Serializer):
    """
    A special serializer for validating the data when a user submits a quiz.
    It expects a dictionary where keys are question IDs and values are answer IDs.
    e.g., {"15": 45, "16": 50}
    """
    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="A dictionary of question_id: answer_id pairs."
    )

    def validate_answers(self, value):
        """
        Check that the provided question and answer IDs are valid.
        """
        for question_id, answer_id in value.items():
            if not Question.objects.filter(id=question_id).exists():
                raise serializers.ValidationError(f"Question with ID {question_id} does not exist.")
            if not Answer.objects.filter(id=answer_id, question_id=question_id).exists():
                raise serializers.ValidationError(f"Answer with ID {answer_id} is not a valid choice for question {question_id}.")
        return value

