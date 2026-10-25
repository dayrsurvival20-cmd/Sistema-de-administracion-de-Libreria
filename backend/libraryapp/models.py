from django.db import models
# Create your models here.

#ORM - Object Relational Mapper

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Category(TimeStampedModel):
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class Author(TimeStampedModel):
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return self.name
    
class Student(TimeStampedModel):
    student_id = models.CharField(max_length=200, unique=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, unique=True)
    mobile = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student_id} - {self.full_name}"
#Llave foranea - Uno a Muchos (Muchos hijos -> Un padre)
class Book(TimeStampedModel):
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    author = models.ForeignKey(Author, on_delete=models.PROTECT)
    isbn = models.CharField(max_length=15, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cover_image = models.ImageField(upload_to="book_covers/", blank=True, null=True)
    iss_issued = models.BooleanField(default=False)
    quantity = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return f"{self.title} ({self.isbn})"
    
class IssuedBook(TimeStampedModel):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='issued_records')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    issued_at = models.DateTimeField(auto_now_add=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)
    fine = models.PositiveIntegerField(default=0)
    remark = models.TextField(blank=True)

    def __str__(self):
        return f"{self.book.title} - {self.student.student_id}"