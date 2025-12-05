from django.urls import path
from .views import RegisterView, LoginView, update_profile_by_email, community_impact_map, LogActivityView, ActivityDetailView, UserDashboardStatsView, UserGamificationStatsView, EnergyForecastView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('update-profile-by-email/', update_profile_by_email, name='update-profile-by-email'),
    path('community-impact-map/', community_impact_map, name='community-impact-map'),
    path('log-activity/', LogActivityView.as_view(), name='log-activity'),
    path('log-activity/<int:pk>/', ActivityDetailView.as_view(), name='delete-activity'),
    path('dashboard-stats/', UserDashboardStatsView.as_view(), name='dashboard-stats'),
    path('gamification-stats/', UserGamificationStatsView.as_view(), name='gamification-stats'),
    path('energy-forecast/', EnergyForecastView.as_view(), name='energy-forecast'),
]
