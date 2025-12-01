from django.urls import path
from . import views

urlpatterns =[   
    path('autofill/', views.autofillBookInfo, name='autofill_infos'),
]

""" path('books/', views.getBooks, name='get_books'),
    path('viewBook/', views.viewBook, name='view_book'), """