from django.urls import path, re_path
from django.contrib.auth import views as auth_views
from .forms import CustomAuthenticationForm
from . import views
# from sesame.views import LoginView

urlpatterns = [
    path("", views.index, name="index"),
    path("admin_index", views.admin_index, name="admin_index"),
    path("user_index", views.user_index, name="user_index"),
    # path("login", views.login_view, name="login"),
    # path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("patientname", views.patientname, name="patientname"),
    path("showdrugdetail", views.showdrugdetail, name="showdrugdetail"),
    path("showprofiledetail/<int:id>", views.showprofiledetail, name="showprofiledetail"),
    path("consultation", views.consultation, name="consultation"),
    path("toggledrugtakingtime", views.toggledrugtakingtime, name="toggledrugtakingtime"),
    path("bodyindex/<str:name>", views.bodyindex, name="bodyindex"),
    path("profile/<str:name>", views.profileindex, name="profile"),
    path("showprofile/<str:name>", views.profile, name="showprofile"),
    #path("showprofile", views.showprofile, name="showprofile"),
    path("drugs_content", views.drugs_content, name="drugs_content"),
    path("accounts/login/", auth_views.LoginView.as_view(template_name='medicines/login.html',next_page="/", authentication_form=CustomAuthenticationForm), name="accounts_login"),
    #path("accounts/logout/", auth_views.LogoutView.as_view(next_page="/"), name="accounts_logout"),
    path("accounts/logout/", auth_views.logout_then_login,{'login_url':'/accounts/login/'} , name="accounts_logout"),
    # path("sesame/login/", LoginView.as_view(), name="sesame-login"),
# url(r'^(one|two)/logout/$', 'django.contrib.auth.views.logout_then_login',
#     {'login_url':'/login/'})
    #re_path(r'^(?:.*)/?$',views.index),
]