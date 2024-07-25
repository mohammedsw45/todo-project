from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from .serializers import TaskSerializer,CreateTaskSerializer,StepSerializer
from .models import Task,Step
from account.permissions import CustomIsAdminUser
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def printMessage(reuest):

    massage = "Hello from Todo"

    return Response(massage)

#Tasks
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_tasks(request):
    if request.method == 'GET':
        # Filter tasks where the current user is in the viewers list
        tasks = Task.objects.filter(viewers=request.user)
        serializer = TaskSerializer(tasks, many=True)
        
        return Response({"tasks": serializer.data}, status=status.HTTP_200_OK)

        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_one_task(request, pk):
    task = get_object_or_404(Task, id=pk, viewers=request.user)
    serializer = TaskSerializer(task, many=False)
    return Response({"task": serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    if request.method == 'POST':
        task_data = request.data
        steps_data = task_data.pop('steps', [])  # Remove 'steps' from task data

        # Set the task owner to the current authenticated user
        task_data['owner'] = request.user.id
        
        # Add all admins as viewers
        admins = User.objects.filter(is_staff=True)
        task_data['viewers'] = [admin.id for admin in admins]
        if task_data['owner'] not in task_data['viewers']:
            task_data['viewers'].append(task_data['owner'])
        # Serialize task data
        task_serializer = CreateTaskSerializer(data=task_data)

        if task_serializer.is_valid():
            # Save the Task instance
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
            serialized_task = TaskSerializer(task_instance)
            return Response(serialized_task.data, status=status.HTTP_201_CREATED)

        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_task(request, pk=None):
    if request.method in ['PUT', 'PATCH']:
        try:
            task_instance = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({"detail": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the requester is either the owner of the task or an admin
        if not (request.user == task_instance.owner or request.user.is_staff):
            return Response({"Error": "You do not have permission to access this task."}, status=status.HTTP_403_FORBIDDEN)

        # Allow admins to update viewers field, while preventing owner from doing so
        if 'viewers' in request.data and not request.user.is_staff:
            return Response({"Error": "Only admins can update viewers."}, status=status.HTTP_403_FORBIDDEN)

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
    if  request.user.is_staff or task.owner== request.user:
        task.delete()
        return Response({"task": "This task was deleted successfully!"}, status=status.HTTP_200_OK)
    
    return Response({"Error": "Sorry you can not delete this task"}, status=status.HTTP_403_FORBIDDEN)
    
    




#Steps

@api_view(['GET'])
def get_steps_for_task(request, pk):
    try:
        task = get_object_or_404(Task, id=pk, viewers=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    steps = Step.objects.filter(task=task)
    serializer = StepSerializer(steps, many=True)
    return Response({"steps": serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_one_step_for_task(request, task_pk, step_pk):
    try:
        task = get_object_or_404(Task, id=task_pk, viewers=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        step = get_object_or_404(Step, id=step_pk, task=task_pk)
    except Task.DoesNotExist:
        return Response({"error": "Step not found for this task"}, status=status.HTTP_404_NOT_FOUND)
    serializer = StepSerializer(step, many=False)
    return Response({"step": serializer.data}, status=status.HTTP_200_OK)

    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_step(request, pk):
    if request.method == 'POST':
        # Ensure the task belongs to the authenticated user
        task = get_object_or_404(Task, id=pk, viewers=request.user)
        
        data = request.data
        # Add task information to the step data
        data['task'] = task.id
        
        step_serializer = StepSerializer(data=data)
        
        if step_serializer.is_valid():
            # Save the step instance with the task reference
            step_serializer.save()

            task = get_object_or_404(Task, id=task.id)
            task_serializer = TaskSerializer(task, many=False)

            return Response({"task": task_serializer.data}, status=status.HTTP_201_CREATED)
        
        return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_step(request, task_pk, step_pk):
    if request.method == 'PUT':
        # Ensure the task belongs to the authenticated user
        task = get_object_or_404(Task, id=task_pk, viewers=request.user)
        
        # Ensure the step belongs to the specified task
        step = get_object_or_404(Step, id=step_pk, task=task)
        
        data = request.data
        step_serializer = StepSerializer(step, data=data, partial=True)
        
        if step_serializer.is_valid():
            step_serializer.save()

            task = get_object_or_404(Task, id=task.id)
            task_serializer = TaskSerializer(task, many=False)

            return Response({"task": task_serializer.data}, status=status.HTTP_200_OK)
        
        return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_step(request, task_pk, step_pk):
    if request.method == 'DELETE':
        # Ensure the task belongs to the authenticated user
        task = get_object_or_404(Task, id=task_pk, user=request.user)

        # Ensure the step belongs to the specified task
        step = get_object_or_404(Step, id=step_pk, task=task)
        
        if  request.user.is_staff or task.owner== request.user:
            step.delete()
            task = Task.objects.get(id=task.id)
            task_serializer = TaskSerializer(task, many=False)

            return Response({"task": task_serializer.data}, status=status.HTTP_200_OK)




#Dashboard

#Tasks
@api_view(['GET'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_get_user_tasks(request):
    if request.method == 'GET':
        # Filter tasks where the current user is in the viewers list
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        
        return Response({"tasks": serializer.data}, status=status.HTTP_200_OK)

        
@api_view(['GET'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_get_one_task(request, pk):
    task = get_object_or_404(Task, id=pk)
    serializer = TaskSerializer(task, many=False)
    return Response({"task": serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_create_task(request):
    if request.method == 'POST':
        task_data = request.data
        steps_data = task_data.pop('steps', [])  # Remove 'steps' from task data

        # Set the task owner to the current authenticated user
        task_data['owner'] = request.user.id
        
        # Add all admins as viewers
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            if admin.id not in task_data['viewers']:
                task_data['viewers'].append(admin.id)
                
        if task_data['owner'] not in task_data['viewers']:
            task_data['viewers'].append(task_data['owner'])
        # Serialize task data
        task_serializer = CreateTaskSerializer(data=task_data)

        if task_serializer.is_valid():
            # Save the Task instance
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
            serialized_task = TaskSerializer(task_instance)
            return Response(serialized_task.data, status=status.HTTP_201_CREATED)

        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_update_task(request, pk=None):
    if request.method in ['PUT', 'PATCH']:
        try:
            task_instance = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({"detail": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the requester is either the owner of the task or an admin
        if not (request.user == task_instance.owner or request.user.is_staff):
            return Response({"Error": "You do not have permission to access this task."}, status=status.HTTP_403_FORBIDDEN)

        # Allow admins to update viewers field, while preventing owner from doing so
        if 'viewers' in request.data and not request.user.is_staff:
            return Response({"Error": "Only admins can update viewers."}, status=status.HTTP_403_FORBIDDEN)

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
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_delete_task(request, pk):
    task = get_object_or_404(Task, id = pk)
    if  request.user.is_staff or task.owner== request.user:
        task.delete()
        return Response({"task": "This task was deleted successfully!"}, status=status.HTTP_200_OK)
    
    return Response({"Error": "Sorry you can not delete this task"}, status=status.HTTP_403_FORBIDDEN)
    
    




#Steps

@api_view(['GET'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_get_steps_for_task(request, pk):
    try:
        task = get_object_or_404(Task, id=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    steps = Step.objects.filter(task=task)
    serializer = StepSerializer(steps, many=True)
    return Response({"steps": serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_get_one_step_for_task(request, task_pk, step_pk):
    try:
        task = get_object_or_404(Task, id=task_pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        step = get_object_or_404(Step, id=step_pk, task=task_pk)
    except Task.DoesNotExist:
        return Response({"error": "Step not found for this task"}, status=status.HTTP_404_NOT_FOUND)
    serializer = StepSerializer(step, many=False)
    return Response({"step": serializer.data}, status=status.HTTP_200_OK)

    


@api_view(['POST'])
@permission_classes([IsAuthenticated,CustomIsAdminUser])
def admin_add_step(request, pk):
    if request.method == 'POST':
        # Ensure the task belongs to the authenticated user
        task = get_object_or_404(Task, id=pk)
        
        data = request.data
        # Add task information to the step data
        data['task'] = task.id
        
        step_serializer = StepSerializer(data=data)
        
        if step_serializer.is_valid():
            # Save the step instance with the task reference
            step_serializer.save()

            task = get_object_or_404(Task, id=task.id)
            task_serializer = TaskSerializer(task, many=False)

            return Response({"task": task_serializer.data}, status=status.HTTP_201_CREATED)
        
        return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_update_step(request, task_pk, step_pk):
    if request.method == 'PUT':
        # Ensure the task belongs to the authenticated user
        task = get_object_or_404(Task, id=task_pk)
        
        # Ensure the step belongs to the specified task
        step = get_object_or_404(Step, id=step_pk, task=task)
        
        data = request.data
        step_serializer = StepSerializer(step, data=data, partial=True)
        
        if step_serializer.is_valid():
            step_serializer.save()

            task = get_object_or_404(Task, id=task.id)
            task_serializer = TaskSerializer(task, many=False)

            return Response({"task": task_serializer.data}, status=status.HTTP_200_OK)
        
        return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def admin_delete_step(request, task_pk, step_pk):
    if request.method == 'DELETE':
        # Ensure the task belongs to the authenticated user
        task = get_object_or_404(Task, id=task_pk, user=request.user)

        # Ensure the step belongs to the specified task
        step = get_object_or_404(Step, id=step_pk, task=task)
        
        if  request.user.is_staff or task.owner== request.user:
            step.delete()
            task = Task.objects.get(id=task.id)
            task_serializer = TaskSerializer(task, many=False)

            return Response({"task": task_serializer.data}, status=status.HTTP_200_OK)
