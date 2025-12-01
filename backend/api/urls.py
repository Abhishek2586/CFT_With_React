from django.urls import path
from .views import RegisterView, LoginView, UpdateProfileView, UpdateProfileByEmailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('update-profile-by-email/', UpdateProfileByEmailView.as_view(), name='update-profile-by-email'),
]
