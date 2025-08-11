from django.contrib import admin
from .models import Course, Enrollment, Video, Quiz, Question, Choice, Submission

# To make choices editable directly within the Question admin page
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3 # Show 3 extra choice fields by default

# Custom admin view for the Question model
class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]

# Register your models here to make them accessible in the Django admin panel.
admin.site.register(Course)
admin.site.register(Enrollment)
admin.site.register(Video)
admin.site.register(Quiz)
admin.site.register(Question, QuestionAdmin) # Register Question with its custom admin view
admin.site.register(Submission)
