from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin

#Manages users
class GenderChoices(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'

class RoleChoices(models.TextChoices):
    STUDENT = 'student', 'Student'
    FACULTY = 'faculty', 'Faculty'
    ADMIN = 'admin', 'Admin'
    ATTENDANCE = 'attendance', 'Attendance'

class UserLoginManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email = email,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email, password, **extra_fields)
            
class UserLogin(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(   
        unique=True
    )

    role = models.CharField(
        max_length=10,
        choices=RoleChoices.choices,
        default=RoleChoices.STUDENT
    )

    is_active = models.BooleanField(default=True)
    
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserLoginManager()
    
    class Meta:
        db_table = "user_login"

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