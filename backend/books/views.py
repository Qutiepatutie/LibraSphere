from json.decoder import JSONDecodeError

from django.utils import timezone
import requests
import re

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def autofillBookInfo(request):
    today = timezone.localtime().isoformat()
    isbn = request.query_params.get("isbn")

    if not isbn:
        return Response({"message":"ISBN is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        book_response = requests.get(f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data", timeout=5)
        book_response.raise_for_status()
    except requests.RequestException:
        return Response({"message":"External service error"}, status=status.HTTP_502_BAD_GATEWAY)

    try:
        data1 = book_response.json()
    except JSONDecodeError:
        return Response({"message" : "No book found"}, status=status.HTTP_404_NOT_FOUND)

    book_data = data1.get(f"ISBN:{isbn}")
    
    if not book_data: 
        return Response({"message" : "No book found"}, status=status.HTTP_404_NOT_FOUND)

    key = book_data.get("key", "")
    parts = key.split("/")
    workKey = parts[2] if len(parts) > 2 else None

    if not workKey:
        return Response({"message": "Invalid book data"}, status=status.HTTP_502_BAD_GATEWAY)
    try:
        work_response = requests.get(f"https://openlibrary.org/books/{workKey}.json", timeout=5)
        work_response.raise_for_status()
    except requests.RequestException:
        return Response({"message":"External service error"}, status=status.HTTP_502_BAD_GATEWAY)
    
    work_data = work_response.json()

    subjectNames = book_data.get("subjects") or []
    subjects = list({s["name"].strip() for s in subjectNames})

    publishDate = book_data.get("publish_date") or ""

    # Format date
    yearPublished = re.sub(r"[^0-9]", "", publishDate)[-4:] or "Unknown"

    raw_desc = work_data.get("description")
    
    if isinstance(raw_desc, dict):
        desc = raw_desc.get("value") or "None"
    elif isinstance(raw_desc, str):
        desc = raw_desc
    else:
        desc = "None"
        
    # Format fields 
    title = book_data.get("title") or "Unknown"
    authors = book_data.get("authors") or []
    publishers = book_data.get("publishers") or []
    
    author = (
        authors[0]["name"]
        if authors
        else "Unknown"
    )
    publisher = (
        publishers[0]["name"]
        if publishers
        else "Unknown"
        
    )
    
    edition = work_data.get("edition_name") or "Unknown"
    pages = book_data.get("number_of_pages") or book_data.get("pagination") or "Unknown"
    cover_url = (
        f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
        if isbn else None
    )

    # Set book object
    book = {
        "title" : title,
        "author" : author,
        "edition" : edition,
        "description" : desc,
        "publisher" : publisher, 
        "year_published" : yearPublished,
        "date_acquired" : today,
        "pages" : pages,
        "tags" : subjects,
        "cover_url" : cover_url
        
    }

    return Response ({
        "message" : "book found",
        "book" : book,
    }, status=status.HTTP_200_OK)
