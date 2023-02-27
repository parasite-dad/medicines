from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, Drug, Consultation, Precription,DrugTakingTime
from django.contrib.auth import get_user_model
User = get_user_model()
#admin.site.register(User)


#admin.site.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id','username','birthday','gender','get_age')
admin.site.register(User,UserAdmin)

#admin.site.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id','patient','daterecord','bodyindex','risklevel')
admin.site.register(Profile,ProfileAdmin)

#admin.site.register(Drug)
class DrugAdmin(admin.ModelAdmin):
    list_display = ('id','drugname','drugusage','drugurl')
admin.site.register(Drug,DrugAdmin)

#admin.site.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('id','patient','symptom','treatment','consultationdate')
admin.site.register(Consultation,ConsultationAdmin)

#admin.site.register(Precription)
class PrecriptionAdmin(admin.ModelAdmin):
    list_display = ('id','consultationid_id','period','drugqty')
admin.site.register(Precription,PrecriptionAdmin) 

#admin.site.register(DrugTakingTime)
class DrugTakingTimeAdmin(admin.ModelAdmin):
    list_display = ('id','consultationid_id','drugtakingdate','patienttakingtime')
admin.site.register(DrugTakingTime,DrugTakingTimeAdmin) 
