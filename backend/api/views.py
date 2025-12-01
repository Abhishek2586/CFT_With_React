from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
            if user:
                login(request, user)
                return Response({"token": "dummy-token", "user": UserSerializer(user).data})
            else:
                return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

class UpdateProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UpdateProfileByEmailView(APIView):
    def put(self, request):
        email = request.data.get("email")
        profile_data = request.data.get("profile", {})
        
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            
            # Update User fields if needed (e.g. email itself, though risky here without verification)
            # For now, just profile fields
            
            profile = user.profile
            profile.first_name = profile_data.get('first_name', profile.first_name)
            profile.last_name = profile_data.get('last_name', profile.last_name)
            profile.phone_no = profile_data.get('phone_no', profile.phone_no)
            profile.city = profile_data.get('city', profile.city)
            profile.state = profile_data.get('state', profile.state)
            profile.save()
            
            return Response({"message": "Profile updated successfully", "user": UserSerializer(user).data})
            
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
