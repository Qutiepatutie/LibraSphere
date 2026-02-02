from django.db import models

#Manages users
class GenderChoices(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'

class RoleChoices(models.TextChoices):
    STUDENT = 'student', 'Student'
    FACULTY = 'faculty', 'Faculty'
    ADMIN = 'admin', 'Admin'

class UserLogin(models.Model):

    email = models.CharField(   
        max_length=100,
        unique=True
    )

    password = models.CharField(
        max_length=128,
        unique=True
    )

    role = models.CharField(
        max_length=10,
        choices=RoleChoices.choices,
        default=RoleChoices.STUDENT
    )

    class Meta:
        db_table = 'user_login'

class UserProfile(models.Model):
    user = models.OneToOneField(
        UserLogin,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile'
    )
    
    first_name = models.CharField(
        max_length=100,
        blank=True
    )
    
    middle_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    last_name = models.CharField(
        max_length=100,
        blank=True
    )

    sex = models.CharField(
        max_length=10,
        choices=GenderChoices.choices,
        blank=True,
        null=True
    )

    id_number = models.CharField(
        max_length=13,
        unique=True
    )

    program = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'user_profile'