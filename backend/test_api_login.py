import requests

url = 'https://cft-with-react-backend.onrender.com/api/login/'
data = {'username': 'header_test_user', 'password': 'password123'}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
