from curses import pair_content
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib import admin
from datetime import datetime
import datetime
from django.forms import ModelForm
from django.utils import timezone
import json
from django.db.models.signals import post_save
from django.dispatch import receiver

#CANNOT ADD THIS CODE AS ERROR HAPPEN, BELOW USER CLASS IS CUSTOM USER CLASS, NOT ORIGINAL
#SO I GUESS CANNOT USE ANY USERCREATIONFORM IN MODELS BUT WORK IN ADDING IN FORMS.PY
#https://code.djangoproject.com/ticket/21616
#from django.contrib.auth.forms import UserCreationForm


from django.contrib.auth import get_user_model
# Create your models here.
class User(AbstractUser):
    GENDER_CHOICES = (
    ('M', 'Male'),
    ('F', 'Female'),
)
    birthday=models.DateField(blank=False)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=False)
    #SEEMS NOT TO STORE AGE AS IT WILL CHANGE EVERY YEAR
    #age=int((datetime.date.today()-birthday).days/365.25)

    def get_age(self):
        age = datetime.date.today()-self.birthday
        return int((age).days/365.25)
    def __str__(self):       
        return f"{self.id} {self.username} {self.birthday} {self.gender} "

class GetProfileRiskLevel(models.Manager):
    def get_queryset(self):
        return super(GetProfileRiskLevel,self).get_queryset().filter(self.risklevel()!='normal')


class Profile(models.Model):
    patient = models.ForeignKey("User", on_delete=models.CASCADE, related_name="profilepatient")
    daterecord = models.DateTimeField(auto_now_add=True)
    bodyindex= models.JSONField(blank=True)
    #returnrisklevel=GetProfileRiskLevel()
    def __str__(self):
        return f"{self.patient} {self.daterecord} {self.bodyindex} "
    #CHECK THE BODY RISK LEVEL BELOW AND WE CAN MODIFY AND EXPAND BELOW TO OTHER ALGORITHM TO CHECK
    def risklevel(self):
        #indexobj=json.loads(self.bodyindex)
        #bmi=float(indexobj['weight'])/(float(indexobj['height'])/100*float(indexobj['height'])/100)
        bmi=float(self.bodyindex['weight'])/((float(self.bodyindex['height'])/100.0)*(float(self.bodyindex['height'])/100.0))
        riskstr=""
        if bmi > 25:
            #return "overweight"
            riskstr=riskstr+"overweight, "
        if self.bodyindex['Systolicblood'] and float(self.bodyindex['Systolicblood'])>150:
            riskstr=riskstr+"high blood pressure, "
        if self.bodyindex['sugar'] and float(self.bodyindex['sugar'])>8:
            riskstr=riskstr+"diabetes"
        if riskstr=="":
            return "normal"    
        else:
            return riskstr 
        
# Normal	18.5 - 25
# Overweight	25 - 30    

class Consultation(models.Model):
    patient = models.ForeignKey("User", on_delete=models.CASCADE, related_name="consultationpatient")
    symptom = models.CharField(max_length=1000,blank=True,default="") 
    treatment = models.TextField(max_length=10000,blank=True,null=True,default="")
    consultationdate = models.DateTimeField(auto_now_add=True)
    def __str__(self):
       return f"{self.id} {self.patient} {self.symptom} {self.treatment} {self.consultationdate.date}"
 

class Precription(models.Model):
    consultationid = models.ForeignKey("Consultation", on_delete=models.CASCADE, related_name="precriptionconsultationid")
    drug = models.ForeignKey("Drug", on_delete=models.CASCADE, related_name="precriptiondrug")
    period = models.IntegerField(blank=True,null=True)
    drugqty=models.IntegerField(blank=True,null=True)
    #patientrecordtime=models.DateTimeField(blank=True,null=True)
    def __str__(self):
        return f"{self.consultationid} {self.drug} {self.period} {self.drugqty} "

class DrugTakingTime(models.Model):
    consultationid = models.ForeignKey("Consultation", on_delete=models.CASCADE, related_name="drugtakingtimeconsultationid")
    drugtakingdate = models.DateTimeField()
    patienttakingtime=models.DateTimeField(blank=True,null=True)
    def __str__(self):
        return f"{self.consultationid} {self.drugtakingdate} {self.patienttakingtime} "

#ADD NUMBER OF DAYS OF ROW RECORD IN DRUGTAKINGTIME ACCORDING TO THE PRESCRIPTION PREIOD THAT THE DOCTOR REQUEST
#https://docs.djangoproject.com/en/4.1/topics/signals/
@receiver(post_save, sender=Precription)
#@receiver(post_save, sender=Consultation)
def add_drug_date(sender, instance,created,**kwargs):
    if created:
        #precriptioninst=Precription.objects.get(consultationid=instance)
        precriptioninst=Precription.objects.filter(consultationid=instance.consultationid)
        #print(precriptioninst)
        if len(precriptioninst) == 1:
            for i in range(instance.period):

                drugtakingtimeobj=DrugTakingTime(consultationid = instance.consultationid,drugtakingdate = instance.consultationid.consultationdate+datetime.timedelta(days=i))
                #drugtakingtimeobj=DrugTakingTime(consultationid = precriptioninst.consultationid,drugtakingdate = precriptioninst.consultationid.consultationdate+datetime.timedelta(days=i+1))
                drugtakingtimeobj.save()
        # for i in instance.period:
        #     self.consultationid = instance.consultationid
        #     self.drugtakingdate = instance.consulatationid.consultationdate+datetime.timedelta(days=i+1)
        #     self.save()
        # for i in instance.period:
        #     self.consultationid = instance.consultationid
        #     self.drugtakingdate = instance.consulatationid.consultationdate+datetime.timedelta(days=i+1)
        #     print(i," ",self.consultationid," ",self.drugtakingdate)
        #     #self.save()
        # print("hello")
        # print(instance.consultationid)
        # print(instance.consultationid.consultationdate+datetime.timedelta(days=1))

class Drug(models.Model):
    drugname=models.CharField(max_length=1000)
    drugusage=models.TextField(max_length=10000,blank=True,null=True)
    drugurl=models.URLField(max_length=500)
    def __str__(self):
        return f"{self.drugname} {self.drugusage} {self.drugurl}"



# class Article(models.Model):
#     author = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#     )
# class UserForm(UserCreationForm):
#     class Meta:
#         model= User
#         fields = '__all__'

# from django.contrib.auth.forms import UserCreationForm
# from myapp.models import CustomUser

# class CustomUserCreationForm(UserCreationForm):
#     class Meta(UserCreationForm.Meta):
#         model = CustomUser
#         fields = UserCreationForm.Meta.fields + ('custom_field',)