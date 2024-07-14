from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import SingUpSerializer,UserSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
def register(request):
    data = request.data
    user = SingUpSerializer(data=data)
    print(user)
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
                # 'refresh': str(refresh),
                # 'access': str(refresh.access_token),
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