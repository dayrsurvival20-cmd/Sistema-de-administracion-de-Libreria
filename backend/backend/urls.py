from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings #To serve media files during development

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('libraryapp.urls'))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
