from django.db import models
from django.utils import timezone
from accounts.models import UserProfile

class StatusChoices(models.TextChoices):
    ACTIVE = 'active', 'Active'
    DUE = 'due', 'Due'
    OVERDUE = 'overdue', 'Overdue'
    PENDING = 'pending', 'Pending'

class BookCallnumberChoices(models.TextChoices):
    GENERAL_INFORMATION = '001', 'General Information'
    PHILOSOPHY_PSYCHOLOGY = '100', 'Philosophy & Psychology'
    RELIGION = '200', 'Religion'
    SOCIAL_SCIENCES = '300', 'Social Sciences'
    LANGUAGE = '400', 'Language'
    SCIENCE = '500', 'Science'
    TECHNOLOGY = '600', 'Technology'
    ARTS_RECREATION = '700', 'Arts & Recreation'
    LITERATURE = '800', 'Literature'
    HISTORY_GEOGRAPHY = '900', 'History & Geography'    

# Manages books
class Books(models.Model):
    call_number = models.CharField(
        primary_key=True,
        max_length=50,
    )

    ISBN = models.CharField(
        max_length=13,
        blank=True,
    )

    title = models.CharField(
        max_length=200
    )
    
    author = models.CharField(
        max_length=100
    )
    
    edition = models.CharField(
        max_length=50,
        blank=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    tags = models.JSONField(
        default=list,
        blank=True
    )

    publisher = models.CharField(
        max_length=100
    )

    year_published = models.CharField(
        max_length=4
    )

    pages = models.CharField(
        max_length=10
    )
    
    #Media
    cover_path = models.CharField(
        max_length=2048,
        blank=True,
        null=True,
    )

    date_acquired = models.CharField(
        max_length=100,
        blank=True
    )

    class Meta:
        db_table = 'books'

    def __str__(self):
        return self.title
    
class BorrowRecords(models.Model):

    borrow_id = models.AutoField(
        primary_key=True
    )

    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE
    )

    book = models.ForeignKey(
        Books,
        on_delete=models.CASCADE
    )

    borrow_date = models.DateTimeField(
        blank=True,
        null=True,
        editable=False
    )

    return_date = models.DateField(
        blank=True,
        null=True
    )

    due_date = models.DateField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE,
    )

    class Meta:
        db_table = 'borrow_records'