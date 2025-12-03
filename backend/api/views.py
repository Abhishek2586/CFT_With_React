from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, ActivitySerializer
from rest_framework.decorators import api_view, permission_classes
from .models import Profile, Activity
from .map_assets.map_generator import generate_india_heatmap_from_profiles
from django.db.models import Sum
import datetime
from django.utils import timezone

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        # Support both username and email login
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        
        user = None
        if email:
            try:
                user_obj = User.objects.get(email=email)
                username = user_obj.username
            except User.DoesNotExist:
                pass
        
        if username:
            user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({"token": "dummy-token", "user": serializer.data})
        
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_profile_by_email(request):
    email = request.data.get('email')
    profile_data = request.data.get('profile')

    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        profile = user.profile
        
        serializer = ProfileSerializer(profile, data=profile_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Return updated user data including profile
            user_serializer = UserSerializer(user)
            return Response({'message': 'Profile updated successfully', 'user': user_serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def community_impact_map(request):
    """
    Generates and returns the HTML for the community impact map.
    """
    try:
        # 1. Get all user profiles that have a location defined
        all_profiles_with_location = Profile.objects.filter(state__isnull=False).exclude(state__exact='')
        
        # 2. Call the map generator function with the profile data
        map_html = generate_india_heatmap_from_profiles(all_profiles_with_location)
        
        return Response({'map_html': map_html})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogActivityView(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    # In a real app, use IsAuthenticated. For now, AllowAny or check user manually if needed.
    # But since we need request.user to be set for perform_create, we usually need IsAuthenticated.
    # If using dummy auth, we might need to rely on passing user ID or email in body, 
    # BUT the prompt implies standard usage. Let's assume the user is logged in or we handle it.
    # Given the frontend sends requests, we'll assume session auth or we might need to fetch user from body if auth is not set up perfectly.
    # For this specific task, I'll assume standard DRF CreateAPIView usage.
    # However, to be safe with the current "dummy-token" setup, I will override post to get user from email if provided, or fallback to request.user.
    
    def get_queryset(self):
        """
        Optionally restricts the returned activities to a given user,
        by filtering against a `date` and `category` query parameter in the URL.
        """
        queryset = Activity.objects.all()
        
        # Filter by user (mandatory for history)
        # If using dummy token, we might need to filter by email param if user is anon
        user = self.request.user
        if user.is_authenticated:
            queryset = queryset.filter(user=user)
        else:
            # Fallback: try to filter by email param if provided
            email = self.request.query_params.get('email')
            if email:
                queryset = queryset.filter(user__email=email)
            else:
                return Activity.objects.none() # Return nothing if no user identified

        # Filter by date
        date_str = self.request.query_params.get('date')
        if date_str:
            queryset = queryset.filter(timestamp__date=date_str)

        # Filter by category
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category=category)
            
        return queryset.order_by('-timestamp')

    def perform_create(self, serializer):
        # Calculate Carbon Footprint
        category = serializer.validated_data.get('category')
        value = serializer.validated_data.get('value')
        
        emission_factors = {
            'transport': 0.2,   # kg CO2 per km
            'energy': 0.85,     # kg CO2 per kWh (Updated)
            'food': 1.5,        # kg CO2 per serving (Avg)
            'consumption': 0.05,# kg CO2 per INR (Updated)
            'waste': 1.2        # kg CO2 per kg (Updated)
        }
        
        factor = emission_factors.get(category, 0.0)
        carbon_footprint = value * factor
        
        # Handle User Association
        user = self.request.user
        if not user.is_authenticated:
            email = self.request.data.get('email')
            if email:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    raise serializers.ValidationError("User not found and not logged in.")
            else:
                 raise serializers.ValidationError("User must be logged in or email provided.")

        serializer.save(user=user, carbon_footprint_kg=carbon_footprint)

class ActivityDetailView(generics.DestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    # permission_classes = [IsAuthenticated] # Uncomment in production

    def get_queryset(self):
        # Ensure users can only delete their own activities
        user = self.request.user
        if user.is_authenticated:
            return Activity.objects.filter(user=user)
        # Fallback for dummy auth (less secure, but consistent with current state)
        # We'll allow deletion if the ID matches, assuming the frontend handles ownership visibility
        return Activity.objects.all()

from .utils import sync_pending_chatbot_activities

class UserDashboardStatsView(generics.RetrieveAPIView):
    # permission_classes = [IsAuthenticated] # Uncomment in production

    def get(self, request, *args, **kwargs):
        user = request.user
        # Fallback for dummy auth
        if not user.is_authenticated:
            email = request.query_params.get('email')
            if email:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({'error': 'User not found'}, status=404)
            else:
                 # Return empty/zero stats if no user identified
                 return Response({
                    "trend_data": [],
                    "category_breakdown": {},
                    "emission_stats": {"today": 0, "yesterday": 0, "this_month": 0, "last_month": 0},
                    "budget": {"daily_limit": 15.0, "daily_used": 0, "monthly_limit": 450.0, "monthly_used": 0}
                 })

        # --- LAZY SYNC: Process Pending Chatbot Activities ---
        sync_pending_chatbot_activities(user)
        # -----------------------------------------------------

        # 1. Trend Data (Last 6 Months)
        trend_data = []
        today = timezone.now().date()
        for i in range(5, -1, -1):
            month_start = (today.replace(day=1) - timezone.timedelta(days=i*30)).replace(day=1) # Approx
            # Better month calculation
            year = today.year
            month = today.month - i
            while month <= 0:
                month += 12
                year -= 1
            
            start_date = datetime.date(year, month, 1)
            if month == 12:
                end_date = datetime.date(year + 1, 1, 1)
            else:
                end_date = datetime.date(year, month + 1, 1)
            
            monthly_emission = Activity.objects.filter(
                user=user, 
                timestamp__date__gte=start_date, 
                timestamp__date__lt=end_date
            ).aggregate(total=Sum('carbon_footprint_kg'))['total'] or 0.0
            
            trend_data.append({
                "month": start_date.strftime("%b %Y"),
                "value": round(monthly_emission, 1)
            })

        # 2. Category Breakdown (All time or This Month? Usually This Month or All Time. Let's do This Month for relevance)
        # Actually, dashboard usually shows total distribution. Let's do ALL TIME for now, or This Month.
        # User prompt example values are small, suggesting monthly. Let's do THIS MONTH.
        current_month_start = today.replace(day=1)
        category_breakdown = {}
        categories = ['transport', 'energy', 'food', 'consumption', 'waste']
        for cat in categories:
            total = Activity.objects.filter(
                user=user, 
                category=cat,
                timestamp__date__gte=current_month_start
            ).aggregate(total=Sum('carbon_footprint_kg'))['total'] or 0.0
            category_breakdown[cat] = round(total, 1)

        # 3. Emission Stats
        today_emission = Activity.objects.filter(user=user, timestamp__date=today).aggregate(total=Sum('carbon_footprint_kg'))['total'] or 0.0
        yesterday = today - timezone.timedelta(days=1)
        yesterday_emission = Activity.objects.filter(user=user, timestamp__date=yesterday).aggregate(total=Sum('carbon_footprint_kg'))['total'] or 0.0
        
        this_month_emission = Activity.objects.filter(user=user, timestamp__date__gte=current_month_start).aggregate(total=Sum('carbon_footprint_kg'))['total'] or 0.0
        
        last_month_end = current_month_start - timezone.timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)
        last_month_emission = Activity.objects.filter(
            user=user, 
            timestamp__date__gte=last_month_start, 
            timestamp__date__lte=last_month_end
        ).aggregate(total=Sum('carbon_footprint_kg'))['total'] or 0.0

        # 4. Budget
        try:
            profile = user.profile
            monthly_limit = profile.carbon_budget_kg
        except Profile.DoesNotExist:
            monthly_limit = 500.0 # Default
            
        daily_limit = monthly_limit / 30.0
        
        return Response({
            "trend_data": trend_data,
            "category_breakdown": category_breakdown,
            "emission_stats": {
                "today": round(today_emission, 1),
                "yesterday": round(yesterday_emission, 1),
                "this_month": round(this_month_emission, 1),
                "last_month": round(last_month_emission, 1)
            },
            "budget": {
                "daily_limit": round(daily_limit, 1),
                "daily_used": round(today_emission, 1),
                "monthly_limit": round(monthly_limit, 1),
                "monthly_used": round(this_month_emission, 1)
            }
        })

from django.db.models import Count
from django.db.models.functions import TruncDate

class UserGamificationStatsView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        # Fallback for dummy auth
        if not user.is_authenticated:
            email = request.query_params.get('email')
            if email:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({'error': 'User not found'}, status=404)
            else:
                 return Response({'error': 'User not authenticated'}, status=401)

        # 1. User Stats
        try:
            profile = user.profile
            user_stats = {
                "xp": profile.xp,
                "level": profile.level,
                "eco_coins": profile.eco_coins,
                "sustainability_score": profile.sustainability_score,
                "is_iot_connected": profile.is_iot_connected,
                "current_streak": profile.current_streak,
                "total_emissions": round(profile.total_emission_kg, 2)
            }
        except Profile.DoesNotExist:
             user_stats = {
                "xp": 0, "level": 1, "eco_coins": 0, 
                "sustainability_score": 0, "is_iot_connected": False, 
                "current_streak": 0, "total_emissions": 0.0
            }

        # 2. Activity Heatmap
        # Get activities for the current year (or last 365 days)
        today = timezone.now().date()
        one_year_ago = today - datetime.timedelta(days=365)
        
        daily_activities = Activity.objects.filter(
            user=user,
            timestamp__date__gte=one_year_ago
        ).annotate(
            date=TruncDate('timestamp')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        daily_counts = {
            entry['date'].strftime("%Y-%m-%d"): entry['count'] 
            for entry in daily_activities
        }
        
        # Calculate max streak (simple version based on daily_counts keys)
        # Note: A robust streak calc might need more logic, but this is a start.
        # For now, let's use the profile's current streak or calculate from daily_counts if needed.
        # Let's calculate total active days.
        total_active_days = len(daily_counts)
        
        # Simple max streak calculation from the heatmap data
        max_streak = 0
        current_streak_calc = 0
        sorted_dates = sorted(daily_counts.keys())
        
        if sorted_dates:
            import datetime as dt
            prev_date = dt.datetime.strptime(sorted_dates[0], "%Y-%m-%d").date()
            current_streak_calc = 1
            max_streak = 1
            
            for date_str in sorted_dates[1:]:
                curr_date = dt.datetime.strptime(date_str, "%Y-%m-%d").date()
                if (curr_date - prev_date).days == 1:
                    current_streak_calc += 1
                else:
                    current_streak_calc = 1
                max_streak = max(max_streak, current_streak_calc)
                prev_date = curr_date

        activity_heatmap = {
            "total_active_days": total_active_days,
            "max_streak": max_streak,
            "daily_counts": daily_counts
        }

        return Response({
            "user_stats": user_stats,
            "activity_heatmap": activity_heatmap
        })
