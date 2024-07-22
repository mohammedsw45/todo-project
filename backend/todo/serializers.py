from rest_framework import serializers
from .models import Task, Step
from account.serializers import UserSerializer
from django.contrib.auth.models import User


class StepSerializer(serializers.ModelSerializer):
    STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('Started', 'Started'),
        ('Finished', 'Finished'),
    ]

    status = serializers.ChoiceField(choices=STATUS_CHOICES, default='To Do')

    class Meta:
        model = Step
        fields = ['id', 'task', 'title', 'body', 'start_time', 'end_time', 'status']
        read_only_fields = ['start_time', 'end_time']

    def validate(self, attrs):
        status = attrs.get('status')
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')

        if status in ['Started', 'Finished'] and not start_time:
            raise serializers.ValidationError("start_time must be set when status is Started or Finished.")

        if start_time and end_time and end_time < start_time:
            raise serializers.ValidationError("end_time cannot be before start_time.")

        return attrs

    def create(self, validated_data):
        return Step.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.body = validated_data.get('body', instance.body)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance

class TaskSerializer(serializers.ModelSerializer):
    steps = serializers.SerializerMethodField(method_name="get_steps", read_only = True)
    viewers = serializers.SerializerMethodField(method_name="get_viewers", read_only = True)
    owner = serializers.SerializerMethodField(method_name="get_owner", read_only = True)

    class Meta:
        model = Task
        fields = "__all__"
    
    def get_owner(self, obj):
        user = obj.owner
        serializer = UserSerializer(user, many=False)
        return serializer.data

    def get_viewers(self, obj):
        viewers = obj.viewers.all()
        serializer = UserSerializer(viewers, many=True)
        return serializer.data

    def get_steps(self, obj):
        steps = Step.objects.filter(task=obj)
        serializer = StepSerializer(steps, many=True)
        return serializer.data

    # def to_representation(self, instance):
    #     # Get the request object from context
    #     request = self.context.get('request')
        
    #     # Check if request user is admin
    #     is_admin = request.user.is_staff if request else False
        
    #     # Conditionally exclude viewers field if not admin
    #     if not is_admin:
    #         self.fields.pop('viewers', None)
        
    #     return super().to_representation(instance)


class CreateTaskSerializer(serializers.ModelSerializer):
    steps = serializers.SerializerMethodField(method_name="get_steps", read_only = True)

    class Meta:
        model = Task
        fields = "__all__"


    def get_steps(self, obj):
        steps = Step.objects.filter(task=obj)
        serializer = StepSerializer(steps, many=True)
        return serializer.data

    
    

