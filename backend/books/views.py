from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
import requests
import re

# Create your views here.
def autofillBookInfo(request):
    today = timezone.localtime().isoformat()

    isbn = request.GET.get("isbn")
    try:
        resp1 = requests.get(f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data", timeout=5)
        resp1.raise_for_status()
    except requests.RequestException:
        return JsonResponse({"status":"failed", "message":"External service error"})

    try:
        data1 = resp1.json()
        bookData1 = data1[f"ISBN:{isbn}"]
    except:
        return JsonResponse({"status": "failed", "message" : "No book found"})

    if not bookData1: 
        return JsonResponse({"status": "failed", "message" : "No book found"})

    key = bookData1.get("key", "")
    parts = key.split("/")
    workKey = parts[2] if len(parts) > 2 else None

    if not workKey:
        return JsonResponse({"status": "failed", "message": "Invalid book data"})
    try:
        resp2 = requests.get(f"https://openlibrary.org/books/{workKey}.json", timeout=5)
        resp2.raise_for_status()
    except requests.RequestException:
        return JsonResponse({"status":"failed", "message":"External service error"})
    
    bookData2 = resp2.json()

    subjectNames = bookData1.get("subjects") or []
    subjects = list({s["name"].strip() for s in subjectNames})

    publishDate = bookData1.get("publish_date") or ""
    yearPublished = re.sub(r"[^0-9]", "", publishDate)[-4:] or "Unknown"

    raw_desc = bookData2.get("description")
    
    if isinstance(raw_desc, dict):
        desc = raw_desc.get("value") or "None"
    elif isinstance(raw_desc, str):
        desc = raw_desc
    else:
        desc = "None"

    authors = bookData1.get("authors") or []
    publishers = bookData1.get("publishers") or []

    return JsonResponse ({
        "status" : "success",
        "message" : "book found",
        "book" : {
            "title" : bookData1.get("title") or "Unknown",
            "author" : authors[0]["name"] if authors else "Unknown",
            "edition" : bookData2.get("edition_name") or "Unknown",
            "description" : desc,
            "publisher" : publishers[0]["name"] if publishers else "Unknown",
            "year_published" : yearPublished,
            "date_acquired" : today,
            "pages" : bookData1.get("number_of_pages") or bookData1.get("pagination") or "Unknown",
            "tags" : subjects,
            "cover_url" : (
                f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
                if isbn else None
            )
        },
    })
