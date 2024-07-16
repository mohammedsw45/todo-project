from django.urls import path
from . import views

urlpatterns = [

    path('', views.printMessage, name="message"),

    #Tasks
    path('tasks', views.get_user_tasks, name='get-user-tasks'),
    path('tasks/<str:pk>', views.get_one_task, name='get-one-task'),
    path('tasks/create/', views.create_task, name='create-task'),
    path('tasks/<str:pk>/update/', views.update_task, name='update-task'),
    path('tasks/<str:pk>/delete/', views.delete_task, name='delete-task'),


    #Steps
    path('tasks/<str:pk>/steps', views.get_steps_for_task, name='get-steps-for-task'),
    path('tasks/<str:task_pk>/steps/<str:step_pk>/', views.get_one_step_for_task, name='get-one-step-for-task'),
    path('tasks/<str:pk>/add/', views.add_step, name='add-step-to-task'),
    path('tasks/<str:task_pk>/update/<str:step_pk>/', views.update_step, name='update-step-for-task'),
    path('tasks/<str:task_pk>/delete/<str:step_pk>/', views.delete_step, name='delete-step-for-task'),

]
