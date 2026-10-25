from django.contrib.auth import authenticate

from django.db.models import Q
from django.utils import timezone
from rest_framework.decorators import api_view

from rest_framework.response import Response 

from .models import *

from .serializers import *

@api_view(["POST"])
def admin_login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        return Response(
            {
                "success" : True,
                "message" : "Entrada exitosa",
                "username" : username,
            },
            status=200
        )
    else:
        return Response(
                {
                    "success" : False,
                    "message" : "Credenciales invalidas"
                },
                status=401
            )

from rest_framework import status


@api_view(["POST"])
def add_category(request):
    name = request.data.get("name")
    category_status = request.data.get("status", "1")

    is_active = True if str(category_status) =="1" else False

    category = Category.objects.create(name = name, is_active = is_active)
    serializer = Categoryserializer(category)

    return Response(
        {
            "success" : True,
            "message" : "Categoria agregada exitosamente",
            "category" : serializer.data,
        },
        status= status.HTTP_201_CREATED
    )

@api_view(["GET"])
def list_categories(request):
    categories = Category.objects.all().order_by("-id")
    serializer = Categoryserializer(categories, many=True)

    return Response(serializer.data, status= status.HTTP_200_OK)


from django.shortcuts import get_object_or_404
@api_view(["PUT"])
def update_category(request, id):

    category = get_object_or_404(Category, id=id)
    name = request.data.get("name")
    category_status = request.data.get("status")

    is_active = True if str(category_status) =="1" else False

    category.name = name
    category.is_active = is_active
    category.save()
    serializer = Categoryserializer(category)

    return Response(
        {
            "success" : True,
            "message" : "Categoria ha sido actualizada exitosamente",
            "category" : serializer.data,
        },
        status= status.HTTP_200_OK
    )

@api_view(["DELETE"])
def delete_category(request, id):

    category = get_object_or_404(Category, id=id)
    category.delete()

    return Response(
        {
            "success" : True,
            "message" : "Categoria ha sido borrada exitosamente",
        },
        status= status.HTTP_200_OK
    )

@api_view(["POST"])
def add_author(request):
    name = request.data.get("name")

    author = Author.objects.create(name = name)
    serializer = Authorserializer(author)

    return Response(
        {
            "success" : True,
            "message" : "autor agregada exitosamente",
            "author" : serializer.data,
        },
        status= status.HTTP_201_CREATED
    )

@api_view(["GET"])
def list_authors(request):
    authors = Author.objects.all().order_by("-id")
    serializer = Authorserializer(authors, many=True)

    return Response(serializer.data, status= status.HTTP_200_OK)

@api_view(["PUT"])
def update_author(request, id):

    author = get_object_or_404(Author, id=id)
    name = request.data.get("name")

    author.name = name
    author.save()
    serializer = Authorserializer(author)

    return Response(
        {
            "success" : True,
            "message" : "Autor ha sido actualizado exitosamente",
            "author" : serializer.data,
        },
        status= status.HTTP_200_OK 
    )

@api_view(["DELETE"])
def delete_author(request, id):
    author = get_object_or_404(Author, id=id)
    author.delete()

    return Response(
        {
            "success" : True,
            "message" : "Autor ha sido borrado exitosamente",
        },
        status= status.HTTP_200_OK
    )


@api_view(["GET"])
def list_books(request):
    books = Book.objects.all().order_by("-id")
    serializer = Bookserializer(books, many=True)

    return Response(serializer.data, status= status.HTTP_200_OK)

from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def add_book(request):
    title = request.data.get("title")
    author_id = request.data.get("author")
    category_id = request.data.get("category")
    isbn = request.data.get("isbn")
    price = request.data.get("price")
    quantity = request.data.get("quantity")
    cover_image = request.FILES.get("cover_image")

    author = Author.objects.get(id=author_id)
    category = Category.objects.get(id=category_id)

    if Book.objects.filter(isbn=isbn).exists():
        return Response(
            {
                "success" : False,
                "message" : "Libro con este codigo ISBN ya existe, por favor, usa un diferente ISBN"
            },
            status = status.HTTP_400_BAD_REQUEST 
        )

    book = Book.objects.create(
        title=title,
        author=author,
        category=category,
        isbn=isbn,
        price=price,
        quantity=quantity,
        cover_image=cover_image
    )

    serializer = Bookserializer(book)

    return Response(
        {
            "success" : True,
            "message" : "libro agregada exitosamente",
            "book" : serializer.data,
        },
        status= status.HTTP_201_CREATED
    )

@api_view(["PUT"])
@parser_classes([MultiPartParser, FormParser])
def update_book(request, id):
    book = get_object_or_404(Book, id=id)

    title = request.data.get("title")
    author_id = request.data.get("author")
    category_id = request.data.get("category")
    price = request.data.get("price")
    quantity = request.data.get("quantity")
    cover_image = request.FILES.get("cover_image")

    author = Author.objects.get(id=author_id)
    category = Category.objects.get(id=category_id)

    book.title = title
    book.author = author
    book.category = category
    book.price = price
    book.quantity = quantity

    if cover_image:
        book.cover_image = cover_image

    book.save()
    serializer = Bookserializer(book) #serializacion de objeto unico

    return Response(
        {
            "success" : True,
            "message" : "Libro ha sido actualizado exitosamente",
            "book" : serializer.data, #serializacion de objeto unico
        },
        status= status.HTTP_200_OK 
    )

@api_view(["DELETE"])
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)
    book.delete()

    return Response(
        {
            "success" : True,
            "message" : "Libro ha sido borrado exitosamente",
        },
        status= status.HTTP_200_OK
    )

from django.contrib.auth.models import User

@api_view(["POST"])
def change_admin_password(request):
    username = request.data.get("username")
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
        return Response(
            {
                "success": False,
                "message": "La nueva contraseña no coincide con la confirmacion."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 6:
        return Response(
            {
                "success": False,
                "message": "La nueva contraseña debe ser de 6 caracteres."
            } ,
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(username=username, is_staff=True)
    except User.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Usuario Admin no encontrado."
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    if not user.check_password(current_password):
        return Response(
            {
                "success": False,
                "message": "La contraseña actual es incorrecta."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    user.set_password(new_password) #CÁLCULO DE LA CONTRASEÑA CON HASH
    user.save()
    
    return Response(
        {
            "success": True,
            "message": "Cambio de contraseña exitosa."
        },
        status=status.HTTP_200_OK
    )

from django.contrib.auth.hashers import make_password

@api_view(["POST"])
def user_signup(request):
    full_name = request.data.get("full_name")
    mobile = request.data.get("mobile")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")

    if password != confirm_password:
        return Response(
            {
                "success": False,
                "message": "La contraseña y la contraseña guardada no coinciden"
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 6:
        return Response(
            {
                "success": False,
                "message": "La contraseña debe ser almenos de 6 caracteres"
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    last_student = Student.objects.all().order_by('-id').first()
    if last_student and last_student.student_id.isdigit():
        new_id_int = int(last_student.student_id) + 1
        new_id = str(new_id_int).zfill(4) #0001 0002 0003

    else:
        new_id_int = 1001

    student_id = str(new_id_int) #Covertir a String, como: "1001"

    if Student.objects.filter(email=email).exists():
        return Response(
            {
                "succes": False,
                "message": "Usuario con este correo ya existe, por favor, usa una direccion de correo diferente."
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    hashed_password = make_password(password)

    student = Student.objects.create(
        student_id = student_id,
        full_name = full_name,
        mobile = mobile,
        email = email,
        password = hashed_password,
        is_active = True,
    )

    return Response(
        {
            "success" : True,
            "message" : "Usuario registrado exitosamente.",
            "student_id" : student.student_id,
            "full_name" : student.full_name,
        },
        status = status.HTTP_201_CREATED
    )

from django.contrib.auth.hashers import check_password


@api_view(["POST"])
def user_login(request):
    login_id = request.data.get("login_id")
    password = request.data.get("password")

    try:
        #if"@" in login_id:
        #    student = Student.objects.get(email = login_id)
        #else:
        #    student = Student.objects.get(student_id = login_id)
        student = Student.objects.get(Q(email = login_id) | Q(student_id = login_id))

    except Student.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "Credenciales invalidas"
            },
            status = status.HTTP_401_UNAUTHORIZED
        )
    
    if not check_password(password, student.password):
        return Response(
            {
                "success" : False,
                "message" : "Credenciales invalidas"
            },
            status = status.HTTP_401_UNAUTHORIZED
        )

    if not student.is_active:
        return Response(
            {
                "success" : False,
                "message" : "Su cuenta de usuario esta inactiva, por favor, contacte al administrador."
            },
            status = status.HTTP_403_FORBIDDEN
        )

    return Response(
        {
            "success" : True,
            "message" : "Ingreso exitoso.",
            "student_id" : student.student_id,
            "full_name" : student.full_name,
            "email": student.email
        },
        status = status.HTTP_200_OK
    )

@api_view(["GET"])
def user_stats(request):
    student_id = request.query_params.get("student_id")

    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "Estudiante no encontrado."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    total_books = Book.objects.count()
    total_issued = IssuedBook.objects.filter(student=student).count()
    not_returned = IssuedBook.objects.filter(student=student, is_returned=False).count()

    stats = {
        "total_books" : total_books,
        "total_issued" : total_issued,
        "not_returned" : not_returned
    }

    return Response(
        {
            "success" : True,
            "stats" : stats
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
def user_list_books(request):
    books = Book.objects.select_related('author', 'category').prefetch_related('issued_records').all().order_by("title")
    serializer =BookListSerializer(books, many=True)
    return Response(
        serializer.data,
        status = status.HTTP_200_OK
    )

@api_view(["GET", "PUT"])
def user_profile(request):
    student_id = request.query_params.get("student_id") or request.data.get("student_id")
    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "Estudiante no encontrado"
            },
            status = status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def user_change_password(request):
    student_id = request.data.get("student_id")
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
        return Response(
            {
                "success" : False,
                "message" : "La nueva contraseña y la contraseña confirmada no coinciden."
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 6:
        return Response(
            {
                "success" : False,
                "message" : "La nueva contraseña debe ser de almenos 6 caracteres o mas."
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "El estudiante no existe."
            },
            status = status.HTTP_404_NOT_FOUND
        )

    if not check_password(current_password, student.password):
        return Response(
            {
                "success" : False,
                "message" : "La contraseña actual es incorrecta."
            },
            status = status.HTTP_401_UNAUTHORIZED
        )

    hashed_new_password = make_password(new_password)
    student.password = hashed_new_password
    student.save()

    return Response(
        {
            "success" : True,
            "message" : "Cambio de contraseña exitoso."
        },
        status = status.HTTP_200_OK
    )

@api_view(["GET"])
def list_registered_students(request):
    students = Student.objects.all().order_by("-id")
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data, status = status.HTTP_200_OK)

@api_view(["POST"])
def block_student(request, id):
    student = get_object_or_404(Student, id=id)
    student.is_active = False
    student.save()

    return Response(
        {
            "success" : False,
            "message" : "El estudiante ha sido bloqueado.",
            "student" :  StudentSerializer(student).data
        },
        status = status.HTTP_200_OK
    )

@api_view(["POST"])
def activate_student(request,id):
    student = get_object_or_404(Student, id=id)
    student.is_active = True
    student.save()

    return Response(
        {
            "success" : True,
            "message" : "Es estudiante ha sido activado."
        },
        status = status.HTTP_200_OK
    )

@api_view(["GET"])
def get_student_by_student_id(request):
    student_id = request.query_params.get("student_id") or request.data.get("student_id")
    try:
        student = Student.objects.get(student_id=student_id)
        serializer = StudentSerializer(student)
        return Response(serializer.data, status = status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "Estudiante no encontrado."
            },
            status = status.HTTP_404_NOT_FOUND
        )

@api_view(["GET"])
def lookup_book_for_issue(request):
    query = request.query_params.get("q")
    try:
        book = Book.objects.get(isbn__iexact=query)
    except Book.DoesNotExist:
        book = Book.objects.filter(title__icontains=query).first()
        if not book:
            return Response(
                {
                    "success" : False,
                    "message" : "Libro no encontrado."
                },
                status = status.HTTP_404_NOT_FOUND
            )

    serializer = Bookserializer(book)
    return Response({"success":True, "book":serializer.data}, status=status.HTTP_200_OK)

@api_view(["POST"])
def issue_book(request):
    student_id = request.data.get("student_id")
    book_id = request.data.get("book_id")
    remark = request.data.get("remark", "")

    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "Estudiante no encontrado."
            },
            status = status.HTTP_404_NOT_FOUND
        )

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response(
            {
                "success" : False,
                "message" : "Libro no encontrado."
            },
            status = status.HTTP_404_NOT_FOUND
        )

    #issued_count = IssuedBook.objects.filter(book=book, is_returned=False).count()
    # available_quantity = book.quantity - issued_count

    if book.quantity <= 0:
        return Response(
            {
                "success" : False,
                "message" : "No hay copias del libro disponibles para emitir."
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    issued_book = IssuedBook.objects.create(
        student = student,
        book = book,
        remark=remark,
        fine=0,
        is_returned = False
    )

    book.quantity -=1
    book.iss_issued=True,
    book.save()

    return Response(
        {
            "success" : False,
            "message" : "Emision de libro exitoso"
        },
        status = status.HTTP_200_OK
    )

@api_view(["GET"])
def list_issued_books(request):
    issued_books = IssuedBook.objects.select_related('student', 'book').all().order_by('-id')
    serializer = IssuedBookSerializer(issued_books, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_issued_book_details(request, id):
    issued_book = get_object_or_404(IssuedBook, id=id)
    serializer = IssuedBookSerializer(issued_book)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def return_book(request, id):
    issued_book = get_object_or_404(IssuedBook, id=id)
    if issued_book.is_returned:
        return Response(
            {
                "success" : False,
                "message" : "Este libro ya ha sido devuelto."
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    fine = request.data.get("fine", 0)

    try:
        fine = int(fine)
    except(ValueError, TypeError):
        return Response(
            {
                "success" : False,
                "message" : "Valor de prestamo invalido"
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    issued_book.is_returned = True
    issued_book.fine = fine
    issued_book.returned_at = timezone.now()
    issued_book.save()

    book = issued_book.book #obtener el objeto del libro relacionado
    book.quantity +=1
    book.iss_issued = book.issued_records.filter(is_returned=False).exists()
    book.save(update_fields=["quantity", "iss_issued"])

    return Response(
        {
            "success" : True,
            "message" : "Libro retornado exitosamente"
        },
        status = status.HTTP_200_OK
    )

@api_view(["GET"])
def student_issue_history(request, student_id):
    student = get_object_or_404(Student, student_id=student_id)
    issue_books = (IssuedBook.objects
                #.filter(student__student_id=student_id)
                .filter(student=student)
                .select_related('student', 'book')
                .order_by("-id"))
    
    issues_serializer = IssuedBookSerializer(issue_books, many=True)
    student_serializer = StudentSerializer(student)
    return Response(
        {
            "student" :  student_serializer.data,
            "issues" : issues_serializer.data
        },
    status=status.HTTP_200_OK
    )

@api_view(["GET"])
def admin_dashboard_stats(request):
    total_students = Student.objects.all().count()
    active_students = Student.objects.filter(is_active=True).count()
    blocked_student = Student.objects.filter(is_active=False).count()
    
    total_books = Book.objects.count()
    available_books = Book.objects.filter(quantity__gt=0).count()
    #out_of_stocks_books = Book.objects.filter(quantity=0).count()
    out_of_stocks_books = Book.objects.filter(quantity__lte=0).count()

    total_categories = Category.objects.count()
    total_authors = Author.objects.count()
    
    total_issued = IssuedBook.objects.count()
    currently_issued = IssuedBook.objects.filter(is_returned=False).count()
    returned_count = IssuedBook.objects.filter(is_returned=True).count()

    data={
        "total_students" : total_students,
        "total_books" : total_books,
        "total_issued" : total_issued,
        "active_students" : active_students,
        "blocked_student" : blocked_student,
        "available_books" : available_books,
        "out_of_stock_books" : out_of_stocks_books,
        "total_categories" : total_categories,
        "total_authors" : total_authors,
        "currently_issued" : currently_issued,
        "returned_count" : returned_count
    }

    return Response(
        data,
        status = status.HTTP_200_OK
    )

@api_view(["GET"])
def user_issued_books(request):
    student_id = request.query_params.get("student_id")
    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:    
        return Response(
            {
                "success" : False,
                "message" : "Estudiante no encontrado."
            },
            status = status.HTTP_404_NOT_FOUND
        )

    issued_books = (
        IssuedBook.objects.filter(student=student)
        .select_related('book', 'student')
        .order_by('-id'))
    serializer = IssuedBookSerializer(issued_books, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)