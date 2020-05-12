from django.urls import path
from . import views
from django.conf.urls import url



urlpatterns = [
    path('', views.home, name='blog-home'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='blog-about'),
    path('checkFilters.php', views.checkFilters, name='checkFilters'),
    path('updateServerFilters.php', views.updateServerFilters, name='updateServerFilters'),
    path('newGroup.php', views.newGroup, name='newGroup'),
    path('group/PH/', views.groupPH, name='PH'),
    path('group/EL/', views.groupEL, name='EL'),
    path('group/UC/', views.groupUC, name='UC'),
    path('alphaSort.php', views.sortAlpha),
    path('alphaUpdateServer.php', views.alphaUpdateServer),
    path('alphaUpdateServerFilters.php', views.alphaUpdateServerFilters)

]

