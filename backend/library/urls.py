from django.urls import path
from . import views

urlpatterns =[
    path('addBook/', views.add_books, name='add_book'),
    path('getBooks/', views.get_books, name='get_books'),
    path('editBook/', views.edit_book, name='edit_book'),
    path('borrowBook/', views.borrow_book, name='borrow_book'),
    path('getUserBorrowedBooks/', views.get_user_borrowed_books, name='get_user_borrowed_books'),
    path('getAllBorrowedBooks/', views.get_all_borrowed_books, name='get_all_borrowed_books'),
    path('acceptBorrowedBook/', views.accept_borrowed_book, name='accept_borrowed_book'),
    path('returnBook/', views.return_book, name='return_book'),
]