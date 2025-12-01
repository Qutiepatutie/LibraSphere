from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
import requests
import re

# Create your views here.

""" def getBooks(request):
    books = []

    generalSearch = request.GET.get("generalsearch", "") or request.GET.get("generalSearch", "") or ""
    category = request.GET.get("category", "")
    
    if generalSearch:
        resp = requests.get(f"http://openlibrary.org/search.json?q={generalSearch.replace(' ','+')}")
        data_key = "docs"
        
    elif category:
        resp = requests.get(f"http://openlibrary.org/subjects/{category}.json?limit=50")
        data_key = "works"

    for work in resp.json().get(data_key, []):
        title = work.get("title")
        key = work.get("key", "")
        workKey = key.split("/")[2] if "/" in key else key

        if data_key =="docs":
            authors = [{"name" : n} for n in work.get("author_name", [])]
            cover_id = work.get("cover_i")

        else:
            authors = work.get("authors", [])
            cover_id = work.get("cover_id")

        if title and authors and len(authors) > 0:
            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg" if cover_id else None

            author = authors[0].get("name")

            books.append({
                "title" : title,
                "author" : author,
                "cover_url" : cover_url,
                "work_key" : workKey
            })

    return JsonResponse(books, safe=False)

def viewBook(request):
    info = []

    work_key = request.GET.get("work_key")
    if not work_key:
        return JsonResponse({"status": "failed", "message" : "Missing work key"})

    resp = requests.get(f"https://openlibrary.org/works/{work_key}/editions.json")
    data = resp.json()
    entries = data.get("entries", [])

    if not entries:
        return JsonResponse({"error" : "Failed to fetch editions"})
    

    edition_key = data["entries"][0]["key"]
    edition_data = requests.get(f"https://openlibrary.org{edition_key}.json").json()

    info.append({
        "description" : (edition_data.get("description", {}).get("value")
            if isinstance(edition_data.get("description"), dict)
            else edition_data.get("description", "No description available")),
        "isbn10" : edition_data.get("isbn_10") or [],
        "isbn13" : edition_data.get("isbn_13") or [],
        "pages": edition_data.get("number_of_pages", "Unknown"),
        "publisher": edition_data.get("publishers", ["Unknown"])[0],
        "year_published": edition_data.get("publish_date", "Unknown"),
        "genres": edition_data.get("subjects", []),
    })
    
    return JsonResponse(info, safe=False) """

def autofillBookInfo(request):
    today = timezone.localtime(timezone.now()).strftime("%B %d, %Y")

    isbn = request.GET.get("isbn")

    resp1 = requests.get(f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data")
    
    try:
        data1 = resp1.json()
        bookData1 = data1[f"ISBN:{isbn}"]
    except:
        return JsonResponse({"message" : "no book found"})

    if not bookData1 or not data1: return JsonResponse({"message" : "no book found"})

    workKey = bookData1.get("key").split("/")[2]
    resp2 = requests.get(f"https://openlibrary.org/books/{workKey}.json")
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

    return JsonResponse ({
        "message" : "book found",
        "title" : bookData1.get("title") or "Unknown",
        "author" : bookData1.get("authors")[0]["name"] or "Unknown",
        "edition" : bookData2.get("edition_name") or "Unknown",
        "description" : desc,
        "publisher" : bookData1.get("publishers")[0]["name"] or "Unknown",
        "year_published" : yearPublished,
        "date_acquired" : today,
        "pages" : bookData1.get("number_of_pages") or bookData1.get("pagination") or "Unknown",
        "tags" : subjects,
        "book_cover_url" : f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg" or "None"
    })
   


