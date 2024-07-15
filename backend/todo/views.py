from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from .serializers import TaskSerializer,StepSerializer
from .models import Task,Step
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def printMessage(reuest):

    massage = "Hello from Todo "

    return Response(massage)

#Tasks
@api_view(['get'])
@permission_classes([IsAuthenticated])
def get_all_tasks(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        
        return Response({"tasks":  serializer.data}, status=status.HTTP_200_OK)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_one_task(request, pk):
    task = get_object_or_404(Task, id=pk)
    if task.user != request.user:
        return Response({"Error": "Sorry you can not get this task"}, status=status.HTTP_403_FORBIDDEN)
    serializer = TaskSerializer(task, many =False)
    return Response({"task":  serializer.data}) 



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    if request.method == 'POST':
        task_data = request.data
        
        steps_data = task_data.pop('steps', [])  # Remove 'steps' from task data
        task_data['user'] = request.user.id
        task_serializer = TaskSerializer(data=task_data, many=False)

        if task_serializer.is_valid():
            # Create the Task instance
            task_instance = task_serializer.save()

            # Create steps associated with the task using StepSerializer
            for step_data in steps_data:
                step_data['task'] = task_instance.id  # Set task ID directly
                step_serializer = StepSerializer(data=step_data)
                if step_serializer.is_valid():
                    step_serializer.save()
                else:
                    # Handle invalid step data
                    return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Return the serialized task instance with steps
            #task_data['steps'] = StepSerializer(Step.objects.filter(task=task_instance), many=True).data
            task = Task.objects.get(id=task_instance.id)
            serializer = TaskSerializer(task, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_task(request, pk=None):
    if request.method in ['PUT', 'PATCH']:
        try:
            task_instance = Task.objects.get(id=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({"detail": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        if task_instance.user != request.user:
            return Response({"Error": "Sorry you can not update this Task"}, status=status.HTTP_403_FORBIDDEN)
        task_data = request.data
        
        steps_data = task_data.pop('steps', [])  # Remove 'steps' from task data

        task_serializer = TaskSerializer(task_instance, data=task_data, partial=True)

        if task_serializer.is_valid():
            task_instance = task_serializer.save()

            # Handle steps if provided in request
            for step_data in steps_data:
                step_data['task'] = task_instance.id  # Ensure task ID is set in each step data
                step_serializer = StepSerializer(data=step_data)
                if step_serializer.is_valid():
                    step_serializer.save()
                else:
                    # Handle invalid step data
                    return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(task_serializer.data, status=status.HTTP_200_OK)
        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request, pk):
    task = get_object_or_404(Task, id = pk)
    if task.user != request.user:
        return Response({"Error": "Sorry you can not delete this task"}, status=status.HTTP_403_FORBIDDEN)
    
    task.delete()
    return Response({"task": "This task was deleted successfully!"}, status=status.HTTP_200_OK)




#Steps

@api_view(['GET'])
def get_steps_for_task(request, pk):
    try:
        task = get_object_or_404(Task, id=pk, user=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    steps = Step.objects.filter(task=task)
    serializer = StepSerializer(steps, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)