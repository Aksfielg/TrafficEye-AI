import requests
r = requests.get('http://localhost:8000/api/analytics/')
print(r.json())
