from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Enrollment, Video, Quiz, Submission

# Serializer for creating new users (registration)
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Fields to expect for registration
        fields = ('username', 'password', 'email')
        # Ensure the password is not readable from the API
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Use create_user to ensure the password is properly hashed
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user

# Serializer for reading user data
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'owner', 'videos']


class EnrollmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'enrolled_at', 'course_id']


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'
