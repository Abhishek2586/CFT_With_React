from django.core.management.base import BaseCommand
from api.models import Community, User
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds the database with initial communities'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding communities...')
        
        # Ensure a superuser or admin exists to be the creator
        user = User.objects.first()
        if not user:
             self.stdout.write(self.style.ERROR('No users found. Please create a user first.'))
             # Create a dummy user if none exists?
             user = User.objects.create_user(username='admin_seeder', password='password123', email='admin@example.com')
             self.stdout.write(f'Created dummy user {user.username}')

        communities_data = [
            {
                "name": "Green Tech Corp",
                "type": "Corporate",
                "description": "Driving sustainability in tech. We focus on reducing e-waste and optimizing energy consumption in data centers.",
                "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
            },
            {
                "name": "Mumbai Cyclists",
                "type": "Neighborhood",
                "description": "Pedaling for a cleaner city. Join our weekend rides and help promote cycling as a primary mode of transport.",
                "image_url": "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=1000",
            },
            {
                "name": "Eco-Students Union",
                "type": "University",
                "description": "Campus recycling initiatives, awareness drives, and zero-waste events led by students.",
                "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
            },
            {
                "name": "Zero Waste Warriors",
                "type": "Neighborhood",
                "description": "Composting, reducing plastic usage, and organizing clean-up drives in our local parks.",
                "image_url": "https://images.unsplash.com/photo-1542601906990-24d4c16419d4?auto=format&fit=crop&q=80&w=1000",
            },
            {
                "name": "Sustainable Startups",
                "type": "Corporate",
                "description": "A network of startups committed to net-zero goals. Share resources and best practices.",
                "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
            },
            {
                "name": "Nature Lovers Club",
                "type": "Neighborhood",
                "description": "Exploring and protecting local biodiversity. Regular nature walks and tree planting drives.",
                "image_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000",
            }
        ]

        for data in communities_data:
            community, created = Community.objects.get_or_create(
                name=data['name'],
                defaults={
                    'type': data['type'],
                    'description': data['description'],
                    'image_url': data['image_url'],
                    'created_by': user,
                    'created_at': timezone.now()
                }
            )
            if created:
                community.members.add(user) # Add creator as member
                self.stdout.write(self.style.SUCCESS(f'Created community: {community.name}'))
            else:
                self.stdout.write(f'Community already exists: {community.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded communities'))
