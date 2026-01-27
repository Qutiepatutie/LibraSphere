from django.urls import path
from . import views

urlpatterns =[
    path('login/', views.login_user, name='login_user'),
    path('register/', views.register_user, name='register_users'),
    path('changePass/', views.change_password, name='change_pass'),
]