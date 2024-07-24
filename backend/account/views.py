from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import SingUpSerializer,UserSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import CustomIsAdminUser

from rest_framework.permissions import IsAuthenticated

from datetime import timedelta
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.utils import timezone
#Dashboard
from .models import Profile
from .serializers import ProfileSerializer
from .serializers import EditUserSerializer, EditProfileSerializer

@api_view(['POST'])
def register(request):
    data = request.data
    user = SingUpSerializer(data=data)
    if user.is_valid():
        if not User.objects.filter(username=data['email']).exists():
            user_obj = User.objects.create(
                first_name = data['first_name'],
                last_name = data['last_name'],
                email = data['email'],
                username = data['email'],
                password = make_password(data['password'])
            )
            refresh = RefreshToken.for_user(user_obj)
            return Response({
                "result": "The user is registered sucessfully"
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "error": "This Email is already exists!"}, 
                status=status.HTTP_400_BAD_REQUEST
                )
    else:
        return Response(user.errors)


#Login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    
    serializer_class = MyTokenObtainPairSerializer
        

@api_view(['GET'])
def printMessage(reuest):

    massage = "Hello from Django "

    return Response(massage)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = UserSerializer(request.user)
    return Response(user.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def update_user(request):
    user = request.user
    user.username = request.data['email']
    user.first_name = request.data['first_name']
    user.last_name = request.data['last_name']
    user.email = request.data['email']
    if request.data['password'] != "":
        user.password = make_password(request.data['password'])

    user.save()
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

def get_current_host(request):
    protocol = request.is_secure() and 'https' or 'http'
    host = request.get_host()
    return "{protocol}://{host}/".format(protocol=protocol, host=host)


@api_view(['POST'])
def forgot_password(request):
    data = request.data
    user = get_object_or_404(User, email=data['email'])
    token = get_random_string(40)
    expire_date = timezone.now() + timedelta(minutes=30)

    user.profile_user.reset_password_token = token
    user.profile_user.reset_password_expire = expire_date
    user.profile_user.save()

    link = f"http://192.168.1.98:8000/account/user/reset_password/{token}"
    body = f"Your password reset link is : {link}"

    try:
        send_mail(
            "Password reset from emarket",
            body,
            "emarket@gmail.com",
            [data['email']],
        )
        return Response({"details": f"Password reset link sent to {data['email']}"})
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def reset_password(request, token):
    data = request.data
    user = get_object_or_404(User, profile_user__reset_password_token = token)
    if user.profile_user.rest_password_expire < timezone.now():
        return Response({"error": "Token is expired"}, status=status.HTTP_400_BAD_REQUEST)
    
    if data['password'] != data['confirmPassword']:
        return Response({"error": "Passwords are not the same"}, status=status.HTTP_400_BAD_REQUEST)
    user.password = make_password(data['password'])
    user.profile_user.reset_password_token = ""
    user.profile_user.reset_password_expire = None
    user.profile_user.save()
    user.save()
    return Response({"details": "Password rest done"})

#Dashboard
@api_view(['GET'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def get_all_profiles(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def get_profile(request, pk):
    profile = get_object_or_404(Profile, id=pk)
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def add_profile(request):
    data = request.data
    user = SingUpSerializer(data=data)
    if user.is_valid():
        if not User.objects.filter(username=data['email']).exists():
            user_obj = User.objects.create(
                first_name = data['first_name'],
                last_name = data['last_name'],
                email = data['email'],
                username = data['email'],
                password = make_password(data['password'])
            )
            if "user_type" in data:
                if data["user_type"]:
                    print(data["user_type"])
                    user_obj.profile_user.user_type = data["user_type"]
                    if data["user_type"] =="admin":
                        user_obj.is_superuser = True
                        user_obj.is_staff = True
                user_obj.profile_user.save()
                user_obj.save()
            refresh = RefreshToken.for_user(user_obj)
            return Response({
                "result": "The user is registered sucessfully"
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "error": "This Email is already exists!"}, 
                status=status.HTTP_400_BAD_REQUEST
                )
    else:
        return Response(user.errors)


# @api_view(['PUT'])
# @permission_classes([IsAuthenticated, CustomIsAdminUser])
# def update_profile(request, pk):
#     try:
#         profile = Profile.objects.get(id=pk)
#     except profile.DoesNotExist:
#         return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

#     data = request.data
#     profile_serializer = EditProfileSerializer(profile, data=data, partial=True)

#     if profile_serializer.is_valid():
#         profile_serializer.save()
#         return Response({"result": "The user has been updated successfully"}, status=status.HTTP_200_OK)
#     else:
#         return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['PUT'])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def update_profile(request, pk):
    try:
        profile = Profile.objects.get(id=pk)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    # Separate user data from profile data
    user_data = data.get('user', None)
    user = profile.user

    # Update user data if provided
    if user_data:
        user_serializer = UserSerializer(user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update profile data
    profile_serializer = EditProfileSerializer(profile, data=data, partial=True)
    if profile_serializer.is_valid():
        profile = profile_serializer.save()

        # Additional logic for admin user type
        if profile.user_type == "admin":
            user.is_superuser = True
            user.is_staff = True
            user.save()
        elif profile.user_type == "employee":
            user.is_superuser = False
            user.is_staff = False
            user.save()

        return Response({"result": "The user has been updated successfully"}, status=status.HTTP_200_OK)
    else:
        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, CustomIsAdminUser])
def delete_profile(request, pk):
    profile = get_object_or_404(Profile, id=pk)
    
    user = get_object_or_404(User, id = profile.user.id)
    if  request.user != user.id:
        user.delete()
        return Response({"task": "This user was deleted successfully!"}, status=status.HTTP_200_OK)
    
    return Response({"Error": "Sorry you can not delete this user"}, status=status.HTTP_403_FORBIDDEN)