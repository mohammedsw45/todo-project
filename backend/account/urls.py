from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [

    path('', views.printMessage, name="message"),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'), ## Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', views.register, name='register'), # Register

    path('user/info', views.current_user, name='user_info'), 
    path('user/update', views.update_user, name='update_user'),
    path('user/forgot_password', views.forgot_password, name='forgot_password'),
    path('user/reset_password/<str:token>', views.reset_password, name='reset_password'), 


    #Dashnoard
    path('profiles/', views.get_all_profiles, name='get_all_profiles'),
    path('profiles/add', views.add_profile, name='add-profile'),
    path('profiles/<str:pk>/update', views.update_profile, name='add-profile'),

]
