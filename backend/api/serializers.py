from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Achievement, UserAchievement, Community, Challenge, UserChallengeProgress, Activity

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'profile_name', 'first_name', 'last_name', 'phone_no', 'city', 'state',
            'carbon_budget_kg', 'total_emission_kg', 'avg_daily_emission_kg',
            'level', 'xp', 'current_streak', 'last_activity_date',
            'eco_coins', 'is_iot_connected', 'sustainability_score'
        )

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ('id', 'achievement', 'date_earned')

class CommunitySerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = '__all__'
        read_only_fields = ('created_by', 'members', 'total_community_emission', 'created_at')

    def get_members_count(self, obj):
        return obj.members.count()

    def get_is_member(self, obj):
        request = self.context.get('request')
        user = None
        
        if request and request.user.is_authenticated:
            user = request.user
        elif request:
             # Fallback for anon requests using query param if available
             email = request.query_params.get('email')
             if email:
                 try:
                     user = User.objects.get(email=email)
                 except User.DoesNotExist:
                     pass
        
        if user:
            return obj.members.filter(id=user.id).exists()
        return False

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Handle image logic: if image exists, use it, else use image_url
        if instance.image:
             # Let DRF handle the full URL for the image field
             pass
        elif instance.image_url:
             representation['image'] = instance.image_url
        return representation

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class UserChallengeProgressSerializer(serializers.ModelSerializer):
    challenge = ChallengeSerializer(read_only=True)
    
    class Meta:
        model = UserChallengeProgress
        fields = ('id', 'challenge', 'current_value', 'is_completed')

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('user', 'carbon_footprint_kg', 'timestamp')

    def to_internal_value(self, data):
        # Polymorphic mapping logic
        category = data.get('category')
        mutable_data = data.copy()
        
        description = ""
        value = 0.0
        unit = ""

        try:
            if category == 'transport':
                mode = data.get('mode', 'Unknown')
                distance = float(data.get('distance', 0))
                description = f"Travel: {mode}"
                value = distance
                unit = 'km'
            
            elif category == 'energy':
                source = data.get('source', 'Unknown')
                usage = float(data.get('usage', 0))
                description = f"Energy: {source}"
                value = usage
                unit = 'kWh'
            
            elif category == 'food':
                diet_type = data.get('dietType', 'Unknown')
                meal_type = data.get('mealType', 'Unknown')
                quantity = float(data.get('quantity', 1))
                description = f"Food: {diet_type} ({meal_type})"
                value = quantity
                unit = data.get('unit', 'serving')
            
            elif category == 'consumption':
                purchase_category = data.get('purchaseCategory', 'Unknown')
                amount = float(data.get('amount', 0))
                description = f"Purchase: {purchase_category}"
                value = amount
                unit = 'INR'
            
            elif category == 'waste':
                waste_type = data.get('wasteType', 'Unknown')
                weight = float(data.get('weight', 0))
                description = f"Waste: {waste_type}"
                value = weight
                unit = 'kg'
                
        except (ValueError, TypeError):
            raise serializers.ValidationError("Invalid data format for value fields.")

        # Set the mapped fields
        mutable_data['description'] = description
        mutable_data['value'] = value
        mutable_data['unit'] = unit
        
        return super().to_internal_value(mutable_data)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.first_name = profile_data.get('first_name', profile.first_name)
        profile.last_name = profile_data.get('last_name', profile.last_name)
        profile.phone_no = profile_data.get('phone_no', profile.phone_no)
        profile.city = profile_data.get('city', profile.city)
        profile.state = profile_data.get('state', profile.state)
        
        # Update new fields if provided
        profile.carbon_budget_kg = profile_data.get('carbon_budget_kg', profile.carbon_budget_kg)
        profile.is_iot_connected = profile_data.get('is_iot_connected', profile.is_iot_connected)
        
        profile.save()

        return instance

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
