from rest_framework import serializers
from .models import Books, BorrowRecords
from accounts.serializers import UserProfileSerializer, UserLoginSerializer

class BooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = [
            "call_number",
            "isbn",
            "title",
            "author",
            "edition",
            "description",
            "tags",
            "publisher",
            "year_published",
            "pages",
            "cover_url",
            "date_acquired"
        ]
        
class AddBooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = [
            "call_number",
            "isbn",
            "title",
            "author",
            "edition",
            "description",
            "tags",
            "publisher",
            "year_published",
            "pages",
            "cover_url",
            "date_acquired"
        ]

    def validate_isbn(self, value):
        if Books.objects.filter(isbn=value).exists():
            raise serializers.ValidationError(
                "Book already exists"
            )
        return value

class AllBorrowRecordSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    email = serializers.CharField(source="user.user.email")
    book = BooksSerializer(read_only=True)
    
    class Meta:
        model = BorrowRecords
        fields = [
            "user",
            "email",
            "book",
            "borrow_date",
            "return_date",
            "due_date",
            "status"
        ]
        
class UserBorrowRecordSerializer(serializers.ModelSerializer):
    cover_url = serializers.CharField(source="book.cover_url")
    
    class Meta:
        model = BorrowRecords
        fields = [
            "cover_url",
            "due_date",
            "status"
        ]