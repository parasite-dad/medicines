
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
#from .models import User
from django.contrib.auth import get_user_model
User=get_user_model()
from django.utils import timezone
#FOR REGISTERATION FORM
class CustomUserCreationForm(UserCreationForm):
    #model = User
    years=range(timezone.now().year,1900,-1)
    MONTHS = {
    1:('jan'), 2:('feb'), 3:('mar'), 4:('apr'),
    5:('may'), 6:('jun'), 7:('jul'), 8:('aug'),
    9:('sep'), 10:('oct'), 11:('nov'), 12:('dec')
}
    birthday = forms.DateField(
    widget=forms.SelectDateWidget(
    empty_label=("Choose Year", "Choose Month", "Choose Day"), years=years, months=MONTHS , attrs={'class':'form-control'}
)
#,help_text="select birthday"
)
    password1 = forms.CharField(widget=forms.PasswordInput(
    attrs={'class':'form-control','type':'password', 'name': 'password1','placeholder':'Password','autocomplete':"new-password"}),
    
    )    
    password2 = forms.CharField(widget=forms.PasswordInput(
    attrs={'class':'form-control','type':'password', 'name': 'password2','placeholder':'Confirm Password','autocomplete':"new-password"}),
    )    
    GENDER_CHOICES = (
    ('M', 'Male'),
    ('F', 'Female'),
)
    gender = forms.CharField(widget=forms.Select(attrs={'class':'form-select'},choices=GENDER_CHOICES))

    class Meta(UserCreationForm.Meta):
        model = User
    #     birthday = forms.DateField(
    #      widget=forms.DateInput(format='%d%m%Y'),
    #      input_formats=['%d%m%Y']
    # )
    #     birthday = forms.DateField(
    #     widget=forms.SelectDateWidget(
    #     empty_label=("Choose Year", "Choose Month", "Choose Day"),
    # ),)
        # widgets = {
        #     'birthday':forms.DateField(format='%d%m%Y')
        # }
        fields = UserCreationForm.Meta.fields + ('birthday','gender')
        widgets = {
            'username' :forms.TextInput(attrs={'class': 'form-control'}),
            #'password1' :forms.PasswordInput(attrs={"placeholder":"Type in password",}),
        }

#FOR USER LOGIN AUTHENTICATION
class CustomAuthenticationForm(AuthenticationForm):
    model = User
    username = forms.CharField(widget=forms.TextInput(
    attrs={'class':'form-control','type':'text', 'name': 'username','placeholder':'Username','autocomplete':"new-username"}, )
    #,help_text="username help"
    )    
    password = forms.CharField(widget=forms.PasswordInput(
    attrs={'class':'form-control','type':'password', 'name': 'password','placeholder':'Password','autocomplete':"new-password"}),
    )    
