from django.urls import path
from . import views

urlpatterns =[   
    path('autofill/', views.autofillBookInfo, name='autofill_infos'),
]
