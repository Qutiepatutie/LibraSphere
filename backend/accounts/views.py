from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
import json

from .models import UserLogin
from .models import UserProfile

@csrf_exempt  # disable CSRF for testing (use proper protection later)
def get_users(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'})

    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        try:
            user = UserLogin.objects.get(email=email)
        except UserLogin.DoesNotExist:
            return JsonResponse({'status': 'failed', 'message': 'Invalid credentials'})
        
        if not check_password(password, user.password):
            return JsonResponse({'status': 'failed', 'message': 'Invalid credentials'})
        
        try:
            profile = user.profile
        except UserProfile.DoesNotExist:
            return JsonResponse({'status': 'failed', 'message': 'User Not Found'})

        return JsonResponse({'status': 'success',
                             'id' : user.id,
                             'user' : profile.first_name,
                             'student_number' : profile.student_number,
                             'role': user.role
        })
    except json.JSONDecodeError:
        return JsonResponse({'error':'Invalid JSON'})

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        first_name = data.get('first_name')
        middle_name = data.get('middle_name')
        last_name = data.get('last_name')
        sex = data.get('sex')
        student_number = data.get('student_number')
        program = data.get('program')
        email = data.get('email')
        password = data.get('confirm_password')
        role = data.get('role')

        if not all([first_name, last_name, student_number, email, password]):
            return JsonResponse({'status': 'failed', 'message': 'Missing required fields'})

        if UserLogin.objects.filter(email=email).exists():
            return JsonResponse({'status': 'failed', 'message': 'User already exists'})
        
        if UserProfile.objects.filter(student_number=student_number).exists():
            return JsonResponse({'status': 'failed', 'message': 'Student Number Already Exists'})

        user_login = UserLogin.objects.create(
            email = email,
            password = make_password(password),
            role=role,
        )

        UserProfile.objects.create(
            user=user_login,
            first_name = first_name,
            middle_name = middle_name,
            last_name = last_name,
            sex = sex,
            student_number = student_number,
            program = program,
        )

        return JsonResponse({'status': 'success', 'message':'Registered Successfully'})
    return JsonResponse({'status': 'failed', 'message': 'invalid request'})