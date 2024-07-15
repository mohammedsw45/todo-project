from django.urls import path
from . import views

urlpatterns = [

    path('', views.printMessage, name="message"),

    #Tasks
    path('tasks', views.get_all_tasks, name='get-all-tasks'),
    path('tasks/<str:pk>', views.get_one_task, name='get-one-task'),
    path('tasks/create/', views.create_task, name='create-task'),
    path('tasks/<str:pk>/update/', views.update_task, name='update-task'),
    path('tasks/<str:pk>/delete/', views.delete_task, name='delete-task'),


    #Steps
    path('tasks/<str:pk>/steps', views.get_steps_for_task, name='get-steps-for-task'),

]
