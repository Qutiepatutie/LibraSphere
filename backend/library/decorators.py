from functools import wraps
from django.http import JsonResponse
from accounts.models import UserLogin, RoleChoices

def admin_role(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):

        #Gets ID Number from the request
        id_number = request.GET.get('id_number')
        if not id_number:
            return JsonResponse({'status' : 'failed', 'message' : 'Missing id number'}, status=400)

        #Checks user role in UserLogin table
        try:
            user_login = UserLogin.objects.get(profile__id_number=id_number)
        except UserLogin.DoesNotExist:
            return JsonResponse({'status' : 'failed', 'message' : 'User not found'}, status=404)
        
        #Checks if user is admin
        if user_login.role != RoleChoices.ADMIN:
            return JsonResponse({'status' : 'failed', 'message' : 'User is not an admin'}, status=403)
        
        return view_func(request, *args, **kwargs)

    return wrapper