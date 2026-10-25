from rest_framework import serializers

from .models import *

class Categoryserializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "is_active", "created_at", "updated_at"]

class Authorserializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name", "created_at", "updated_at"]

class Bookserializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    class Meta:
        model = Book
        fields = ["id", "title", "author", "author_name", "category", "category_name", "isbn", "price", "cover_image", "iss_issued", "quantity", "created_at", "updated_at"]

class BookListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    available_quantity = serializers.SerializerMethodField() #nuevo campo disponible
    class Meta:
        model = Book
        fields = ["id", "title", "author", "author_name", "category", "category_name", "isbn", "price", "cover_image", "iss_issued", "quantity", "created_at", "updated_at", "available_quantity"]

    def get_available_quantity(self, obj):
        issued_count = obj.issued_records.filter(book=obj, is_returned=False).count()
        available = obj.quantity - issued_count
        return available if available >= 0 else 0


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "student_id", "full_name", "email", "mobile", "is_active", "created_at", "updated_at"]


class IssuedBookSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    student_id = serializers.CharField(source="student.student_id", read_only=True)
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_isbn = serializers.CharField(source="book.isbn", read_only=True)
    book_cover = serializers.ImageField(source="book.cover_image", read_only=True)
    class Meta:
        model = IssuedBook
        fields = ["id", "book", "book_title", "book_isbn", "book_cover", "student", "student_id", "student_name",
                "issued_at", "returned_at", "is_returned", "fine", "remark", "created_at", "updated_at"]