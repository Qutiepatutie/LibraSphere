import json
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.utils import timezone

from .models import Books, BorrowRecords, UserProfile, StatusChoices

def get_books(request):
    if request.method != 'GET':
        return JsonResponse({'status' : 'failed', 'message': 'Invalid Request method'}) 
    try:
        books = list(Books.objects.values())
        return JsonResponse({"status":"success", "message":"Books fetched Successfully", "data": books})
    except Exception as e:
        return JsonResponse({"status":"failed", "message":"Cannot Fetch Books", "data":[], "error":str(e)})

@csrf_exempt
def add_books(request):
    if request.method != 'POST':
        return JsonResponse({'status' : 'failed', 'message': 'Invalid Request method'}) 
    try:
        data = json.loads(request.body)

        call_number = data.get("callNumber")
        isbn = data.get("isbn")
        title = data.get("title")
        edition = data.get("edition")
        author = data.get("author")
        publisher = data.get("publisher")
        description = data.get("description")
        year_published = data.get("yearPublished")
        pages = data.get("pages")
        cover_url = data.get("coverURL")
        tags = data.get("tags")
        date_acquired = data.get("dateAcquired")
        
    except Exception as e:
        return JsonResponse({"status":"failed", "message":"Invalid JSON", "error":str(e)})

    if not all([call_number, isbn, title, author]):
        return JsonResponse({'status': 'failed', 'message': 'missing important fields'})
    
    if Books.objects.filter(call_number=call_number).exists() or Books.objects.filter(isbn=isbn).exists():
        return JsonResponse({'status': 'failed', 'message': 'Book already exists!'})
    
    Books.objects.create(
        call_number = call_number,
        isbn = isbn,
        title = title,
        edition = edition,
        author = author,
        publisher = publisher,
        description = description,
        year_published = year_published,
        pages = pages,
        cover_url = cover_url,
        tags = tags,
        date_acquired = date_acquired
    )

    return JsonResponse ({'status': 'success', 'message':'Book Successfully Added!'})

@csrf_exempt
def edit_book(request):
    if request.method != 'POST':
        return JsonResponse({"status":"failed", "message":"Invalid request method"})
    
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse({"status":"failed", "message":"Invalid JSON", "error":str(e)})
    
    isbn = data.get("isbn")
    if not isbn:
        return JsonResponse({"status":"failed", "message":"Missing isbn"})
    
    try:
        book = Books.objects.get(isbn=isbn)
    except Books.DoesNotExist:
        return JsonResponse({"status":"failed", "message":"Book does not exist"})

    new_call_number = data.get("callNumber")

    if new_call_number and Books.objects.exclude(pk=book.pk).filter(call_number=new_call_number).exists():
        return JsonResponse({"status":"failed", "message":"Call number already exists"})
    
    book.description = data.get("description", book.description)
    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.call_number = new_call_number or book.call_number
    book.pages = data.get("pages", book.pages)
    book.publisher = data.get("publisher", book.publisher)
    book.year_published = data.get("yearPublished", book.year_published)
    book.tags = data.get("tags", book.tags)

    book.save()

    return JsonResponse ({'status': 'success', 'message':'Book Successfully Edited!'})

@csrf_exempt
def borrow_book(request):
    if request.method != 'POST':
        return JsonResponse({"status":"failed", "message":"Invalid request method"})
    
    try:
        data = json.loads(request.body)
        id_number = data.get("id_number")
        isbn = data.get("isbn")
    except Exception as e:
        return JsonResponse({"status":"failed", "message":"Invalid JSON", "error":str(e)})
    
    try:
        user = UserProfile.objects.get(id_number=id_number)
        book = Books.objects.get(isbn=isbn)

    except UserProfile.DoesNotExist:
        return JsonResponse({"status":"failed", "message":"User not found"})
    
    except Books.DoesNotExist:
        return JsonResponse({"status":"failed", "message":"Book not found"})
    
    if BorrowRecords.objects.filter(book=book, return_date__isnull=True).exists():
        return JsonResponse({"status":"failed", "message":"Book is already borrowed"})
    
    BorrowRecords.objects.create(
        status = StatusChoices.PENDING,
        user = user,
        book = book
    )

    return JsonResponse({"status":"success", "message":"Book successfully borrowed"})

@csrf_exempt
def get_user_borrowed_books(request):
    if request.method != "POST":
        return JsonResponse({"status":"error", "message":"Invalid request method"})
    
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse({"status":"error", "message":"Invalid JSON", "error":str(e)})
    
    id_number = data.get("id")
    try:
        user = UserProfile.objects.get(id_number=id_number)

    except UserProfile.DoesNotExist:
        return JsonResponse({"status":"failed", "message":"User not found"})
    
    borrowed_books = BorrowRecords.objects.filter(user=user, return_date__isnull=True)
    
    books = []

    for record in borrowed_books:
        book = record.book
        books.append({
            "cover_url": book.cover_url,
            "status": record.status,
            "due_date": record.due_date
        })

    return JsonResponse({"status":"success", "books": books})

@csrf_exempt
def get_all_borrowed_books(request):
    try:
        records = BorrowRecords.objects.filter(user__user__isnull=False).select_related("user__user", "book")

        data=[]
        for r in records:
            record = model_to_dict(r)

            user_dict = model_to_dict(r.user)
            user_dict["email"] = r.user.user.email

            book_dict = model_to_dict(r.book)

            record["user"] = user_dict
            record["book"] = book_dict

            data.append(record)

        return JsonResponse({"status":"success", "message":"Borrowed books fetched successfully", "data":data})
    except Exception as e:
        return JsonResponse({"status":"failed", "message":"Borrowed books fetch failed", "data":[], "error":str(e)})

@csrf_exempt
def accept_borrowed_book(request):
    if request.method != "POST":
        return JsonResponse({"status":"failed", "message":"Invalid request method"})
    
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse({"status":"failed", "message":"Invalid JSON", "error":str(e)})
    
    isbn = data.get("isbn")
    call_num = data.get("call_num")

    
    book_record = BorrowRecords.objects.filter(book__isbn=isbn, book__call_number=call_num, return_date__isnull=True).first()
    if not book_record:
        return JsonResponse({"status":"failed", "message":"Book not found"})

    book_record.borrow_date = timezone.now()
    book_record.due_date = timezone.now().date() + timezone.timedelta(days=7)
    book_record.status = StatusChoices.ACTIVE

    book_record.save()

    return JsonResponse({
        "status":"success",
        "message":"Borrower Accepted",
        "book" : {
                "status": book_record.status,
                "due_date":book_record.due_date.isoformat(),
            }
        });

@csrf_exempt
def return_book(request):
    if request.method != "POST":
        return JsonResponse({"status":"failed", "message":"Invalid request method"})
    
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse({"status":"failed", "message":"Invalid JSON", "error": str(e)})
    
    isbn = data.get("isbn")
    call_num = data.get("call_num")

    book = BorrowRecords.objects.filter(book__isbn=isbn, book__call_number=call_num, return_date__isnull=True).first()
    if not book:
        return JsonResponse({"status": "failed", "message": "No Book returned/cancelled"})

    book.status = StatusChoices.RETURNED
    book.return_date = timezone.now().date()
    book.save()

    return JsonResponse({"status": "success", "message": "Book returned/cancelled"})