from django.contrib.auth.hashers import make_password, check_password

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import UserLogin
from .models import UserProfile

from .serializers import UserLoginSerializer

@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = UserLogin.objects.get(email=email)
    except UserLogin.DoesNotExist:
        return Response({"message":"Invalid Credentials"}, status=status.HTTP_404_NOT_FOUND)

    if not check_password(password, user.password):
        return Response({"message":"Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = UserLoginSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)
        
# @csrf_exempt  # disable CSRF for testing (use proper protection later)
# def login_user(request):
#     if request.method != 'POST':
#         return JsonResponse({'status':'failed', 'message': 'POST request required'})

#     try:
#         data = json.loads(request.body)
#     except json.JSONDecodeError:
#         return JsonResponse({'status':'failed', 'message':'Invalid JSON'})

#     email = data.get('email')
#     password = data.get('password')

#     try:
#         user = UserLogin.objects.get(email=email)
#     except UserLogin.DoesNotExist:
#         return JsonResponse({'status': 'failed', 'message': 'Invalid credentials'})
    
#     if not check_password(password, user.password):
#         return JsonResponse({'status': 'failed', 'message': 'Invalid credentials'})
    
#     try:
#         profile = user.profile
#     except UserProfile.DoesNotExist:
#         return JsonResponse({'status': 'failed', 'message': 'User Not Found'})
    
#     refresh = RefreshToken.for_user(user)

#     access_token = str(refresh.access_token)
#     refresh_token = str(refresh)

#     return JsonResponse({'status': 'success',
#                             'message' : "Successfully logged in",
#                             'id' : user.id,
#                             'user' : profile.first_name,
#                             'id_number' : profile.id_number,
#                             'role': user.role,
#                             'access': access_token,
#                             'refresh' : refresh_token,
#     })

@api_view(["POST"])
def register_user(request):
    first_name = request.data.get('first_name')
    middle_name = request.data.get('middle_name')
    last_name = request.data.get('last_name')
    sex = request.data.get('sex')
    id_number = request.data.get('id_number')
    program = request.data.get('program')
    email = request.data.get('email')
    password = request.data.get('confirm_password')
    role = request.data.get('role')

    if not all([first_name, last_name, id_number, email, password]):
        return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    if UserLogin.objects.filter(email=email).exists():
        return Response({"message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if UserProfile.objects.filter(id_number=id_number).exists():
        return Response({"message": "ID number already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = UserLogin.objects.create(
        email = email,
        password = make_password(password),
        role = role
    )

    UserProfile.objects.create(
        user = user,
        first_name = first_name,
        middle_name = middle_name,
        last_name = last_name,
        sex = sex,
        id_number = id_number,
        program = program,
    )

    return Response({"message": "Registered Successfully"}, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def change_password(request):
    email = request.data.get("email")
    newPass = request.data.get("newPass")

    try:
        user = UserLogin.objects.get(email=email)
    except UserLogin.DoesNotExist:
        return Response({"message":"Email does not exist"}, status=status.HTTP_404_NOT_FOUND)

    if check_password(newPass, user.password):
        return Response({"message": "Old password can\'t be the new password"}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(newPass)
    user.save()

    return Response({"message":"Password Changed Successfully"}, status=status.HTTP_200_OK)