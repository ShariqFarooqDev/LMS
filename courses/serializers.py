from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Enrollment, Video, Quiz, Question, Choice, Submission

# --- Existing Serializers ---
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# --- THIS IS THE UPDATED SERIALIZER ---
class VideoSerializer(serializers.ModelSerializer):
    # This ensures the full URL is returned for the video file.
    video_file = serializers.FileField(use_url=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_file', 'course']


class SimpleQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title']

class CourseSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    videos = VideoSerializer(many=True, read_only=True)
    quizzes = SimpleQuizSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'owner', 'videos', 'quizzes']

class EnrollmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'enrolled_at', 'course_id']
        unique_together = ('user', 'course')

class StudentChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text']

class StudentQuestionSerializer(serializers.ModelSerializer):
    choices = StudentChoiceSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizDetailSerializer(serializers.ModelSerializer):
    questions = StudentQuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions']

class SubmissionSerializer(serializers.ModelSerializer):
    answers = serializers.JSONField(write_only=True, required=False)
    quiz = SimpleQuizSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'quiz', 'user', 'score', 'submitted_at', 'answers']
        read_only_fields = ['score', 'submitted_at']

    def create(self, validated_data):
        answers = validated_data.pop('answers')
        quiz = self.context['quiz']
        user = self.context['request'].user
        if Submission.objects.filter(quiz=quiz, user=user).exists():
            raise serializers.ValidationError("You have already submitted this quiz.")
        total_questions = quiz.questions.count()
        correct_answers = 0
        for question_id, choice_id in answers.items():
            try:
                question = Question.objects.get(id=question_id, quiz=quiz)
                correct_choice = Choice.objects.get(question=question, is_correct=True)
                if correct_choice.id == int(choice_id):
                    correct_answers += 1
            except (Question.DoesNotExist, Choice.DoesNotExist, ValueError):
                continue
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        submission = Submission.objects.create(quiz=quiz, user=user, score=score)
        return submission
