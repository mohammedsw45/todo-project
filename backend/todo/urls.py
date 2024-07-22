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


    #Admin Panel

    #Tasks
    path('admin/tasks', views.admin_get_user_tasks, name='admin-get-user-tasks'),
    path('admin/tasks/<str:pk>', views.admin_get_one_task, name='admin-get-one-task'),
    path('admin/tasks/create/', views.admin_create_task, name='admin-create-task'),
    path('admin/tasks/<str:pk>/update/', views.admin_update_task, name='admin-update-task'),
    path('admin/tasks/<str:pk>/delete/', views.admin_delete_task, name='admin-delete-task'),


    #Steps
    path('admin/tasks/<str:pk>/steps', views.admin_get_steps_for_task, name='admin-get-steps-for-task'),
    path('admin/tasks/<str:task_pk>/steps/<str:step_pk>/', views.admin_get_one_step_for_task, name='admin-get-one-step-for-task'),
    path('admin/tasks/<str:pk>/add/', views.admin_add_step, name='admin-add-step-to-task'),
    path('admin/tasks/<str:task_pk>/update/<str:step_pk>/', views.admin_update_step, name='admin-update-step-for-task'),
    path('admin/tasks/<str:task_pk>/delete/<str:step_pk>/', views.admin_delete_step, name='admin-delete-step-for-task'),

]
