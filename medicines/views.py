from ast import Break
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import DrugTakingTime, User, Profile, Drug, Consultation, Precription, DrugTakingTime
from googletrans import Translator
from bs4 import BeautifulSoup
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm as auth_register_form
from django.contrib.auth.password_validation import validate_password
#from .models import UserForm
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
import json
# from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.core.paginator import Paginator
import pandas as pd
import sqlite3 as sql
from django.core import serializers
from django.utils import timezone
from datetime import datetime, timedelta


def user_check(user):
    return True if user.username=="admin" else False

#BELOW RETURN DIFFERENT ADMIN_INDEX.HTML, USER_INDEX.HTML OR  CONTENT DEPEND IT IS PATIENT OR CLINIC (NO REACT)
@login_required(login_url='/accounts/login/')
def index(request):
    if request.user.username == "admin":
        return render(request, 'medicines/index.html')
        return admin_index(request)
    else:
        return render(request, 'medicines/index.html')
        return user_index(request)
  
#THIS IS FOR ADMIN TO SEE PROFILE OF PATIENT, IF YOU LOGIN AS PATIENT 
#AND WANT TO SEE OTHER PATIENTS, YOU ARE NOT ALLOWED AND REDIRECT TO LOGIN PAGE
@login_required(login_url='/accounts/login/')
def profileindex(request,name):
    if request.user.username == "admin":
        return render(request, 'medicines/index.html')
    else:
        return HttpResponseRedirect(reverse("accounts_login"))
        

#MAIN INDEX PAGE FOR ADMIN USER

def admin_index(request):
    today=datetime.today()
    yesterday=today-timedelta(days=1)
    #print(yesterday.date())
    #print(yesterday)
    
    #GET ALL PATIENT RECORD WITH DRUG TAKING DATE IS YESTERDAY BUT DID NOT TAKE PILLS YESTERDAY
    #consultation=Consultation.objects.all().order_by('-consultationdate')
    consultation=Consultation.objects.filter(drugtakingtimeconsultationid__drugtakingdate__date=yesterday,drugtakingtimeconsultationid__patienttakingtime__isnull=True).order_by('-consultationdate')
    consultationid=[]
    patientname=[]
    
    for i in range(len(consultation)):
        consultationid.append(consultation[i].id)
        patientname.append(consultation[i].patient.username)
    #precription=Precription.objects.filter(consultationid=consultation)
    precription=Precription.objects.filter(consultationid_id__in=consultationid)
    #print(precription)
    drugtakingtime=DrugTakingTime.objects.filter(consultationid_id__in=consultationid)
    #print(len(drugtakingtime))

    #BELOW METHOD CHAIN QUERY IS DIFFERENT FROM THE ABOVE QUERY
    #consultation=Consultation.objects.filter(drugtakingtimeconsultationid__drugtakingdate__date=yesterday).filter(drugtakingtimeconsultationid__patienttakingtime__isnull=True).order_by('-consultationdate')
    #consultation=Consultation.objects.filter(drugtakingtimeconsultationid__patienttakingtime__isnull=True).filter(drugtakingtimeconsultationid__drugtakingdate__date=yesterday).order_by('-consultationdate')
    # for i in range(len(consultation)):
    #     print(consultation[i])
    #print(consultation)
    #consultation=Consultation.objects.all().order_by('-consultationdate')
    # drugtaking=DrugTakingTime.objects.filter(yesterday==nul)
    
    #bodyindex=Profile.returnrisklevel.all().order_by('-daterecord')
    #bodyindex=Profile.objects.all().order_by('-daterecord')
    
    #drug=[drugid.drug for drugid in precription ]

    #GET THE PATIENT RECORD OF BODY INDEX WHO RECORD BODY INDEX YESTERDAY, DOCTOR CAN SEE THE RISK LEVEL
    bodyindex=Profile.objects.filter(daterecord__date=yesterday).order_by('-daterecord')
    profile=[]
    bodyindexpatient=[]
    for i in range(len(bodyindex)):
        #print (bodyindex[i].risklevel())
        if bodyindex[i].risklevel() != 'normal':
            #print (bodyindex[i])
            #print( bodyindex[i].patient.username)
            #bodyindex[i]['name']=bodyindex[i].patient.username
            profile.append(bodyindex[i])
            bodyindexpatient.append(bodyindex[i].patient.username)
    for i in range(len(profile)):
        profile[i].bodyindex['risklevel']=profile[i].risklevel()
    #bodyindex=Profile.objects.filter(risklevel='normal').order_by('-daterecord')
    #profile=Profile.objects.filter(patient=patient).order_by('-daterecord')
    #profile=Profile.objects.filter(id=10).order_by('-daterecord')

    #MAKE A DATARANGE ARRAY STARTING YESTERDAY
    daterange=[yesterday-timedelta(days=2),yesterday-timedelta(days=1),yesterday]
    
    #FOR RESPONSE TO FRONTEND BY BULK WRAP ALL DATA
    admindetail=[]
    admindetail.append(serializers.serialize('json',consultation))
    admindetail.append(serializers.serialize('json',profile))
    admindetail.append(serializers.serialize('json',precription))
    admindetail.append(serializers.serialize('json',drugtakingtime))
    #admindetail.append(serializers.serialize('json',daterange))
    admindetail.append({'daterange':daterange})
    admindetail.append({'patientname':patientname})
    admindetail.append({'bodyindexpatient':bodyindexpatient})
    
    return JsonResponse(admindetail, safe=False)
    
    #BELOW CODE FOR REGULAR JAVASCRIPT (NO REACT) AND USING DJANGO PAGEINATION
    consultation_paginator = Paginator(consultation, 5)
    consultation_page_number = request.GET.get('cpage')
    consultation_page_obj = consultation_paginator.get_page(consultation_page_number)
    profile_paginator = Paginator(profile, 5)  
    profile_page_number = request.GET.get('page')
    profile_page_obj = profile_paginator.get_page(profile_page_number)
    #return HttpResponse(bodyindex)
    daterange=[yesterday-timedelta(days=2),yesterday-timedelta(days=1),yesterday]
    return render(request, 'medicines/admin_index.html',{'dateranges':daterange,'cpagenumber':range(consultation_page_obj.paginator.num_pages),'pagenumber':range(profile_page_obj.paginator.num_pages),'consultation_page_obj': consultation_page_obj,'profile_page_obj': profile_page_obj,'consultations':consultation,'profiles':profile,'precriptions':precription,'drugtakingtimes':drugtakingtime})
    
#THIS INDEX VIEW IS FOR PATIENT 
#@login_required(login_url='/accounts/login/')
def user_index(request):
    today=datetime.today()
    yesterday=today-timedelta(days=1)
    username=request.user.username
    #patient=User.objects.get(username=username)    
    patient=User.objects.filter(username=username)        
    consultation=Consultation.objects.filter(patient=patient[0]).order_by('-consultationdate')
    #print(consultation)
    profile=Profile.objects.filter(patient=patient[0]).order_by('-daterecord')
    #profile=Profile.objects.filter(id=10).order_by('-daterecord')
    #APPEND THE RISKLEVEL METHOD TO THE PROFILE FIELD
    for i in range(len(profile)):
        profile[i].bodyindex['risklevel']=profile[i].risklevel()
        #print(profile[i].bodyindex)
    
    precription=Precription.objects.filter(consultationid=consultation)
    #print(precription)
    consultationid=[]
    for i in range(len(consultation)):
        consultationid.append(consultation[i].id)

    drugtakingtime=DrugTakingTime.objects.filter(consultationid_id=consultationid[0]).order_by('-consultationid_id')
    #print(drugtakingtime)
    #BELOW IS FOR GENERATING MODAL BOX TO REMIND PATIENT NOT TAKING PILLS YESTERDAY
    modalreminder=""
    for i in range(len(drugtakingtime)):
        #print (drugtakingtime[i].drugtakingdate.date()==yesterday.date())
        #print(yesterday)
        if drugtakingtime[i].drugtakingdate.date() == yesterday.date() and drugtakingtime[i].patienttakingtime is None:
            for j in range(len(drugtakingtime)):
                if drugtakingtime[j].drugtakingdate.date() == today.date() and drugtakingtime[j].patienttakingtime is None: 
                    modalreminder=yesterday.date()
                    break
                else:
                    modalreminder=""
                    #break

    #BELOW CODE FOR DJANGO PAGINATION
    # consultation_paginator = Paginator(consultation, 5)
    # consultation_page_number = request.GET.get('cpage')
    # consultation_page_obj = consultation_paginator.get_page(consultation_page_number)
    # profile_paginator = Paginator(profile, 5)
    # profile_page_number = request.GET.get('page')
    # profile_page_obj = profile_paginator.get_page(profile_page_number) 
    # return render(request, 'medicines/user_index.html',{'modalreminder':modalreminder,'cpagenumber':range(consultation_page_obj.paginator.num_pages),'pagenumber':range(profile_page_obj.paginator.num_pages),'consultation_page_obj': consultation_page_obj,'profile_page_obj': profile_page_obj,'consultations':consultation,'profiles':profile,'precriptions':precription,'drugtakingtimes':drugtakingtime})
    
    #FOR RESPONSE TO FRONTEND BY BULK WRAP ALL DATA
    admindetail=[]
    admindetail.append(serializers.serialize('json',patient))
    admindetail.append(serializers.serialize('json',profile))
    admindetail.append(serializers.serialize('json',consultation))
    #admindetail.append(serializers.serialize('json',precription))
    #admindetail.append(serializers.serialize('json',drugtakingtime))
    admindetail.append({'modalreminder':modalreminder})
    return JsonResponse(admindetail, safe=False)

#GET THE PATIENT USER PROFILE 
@login_required(login_url='/accounts/login/')
def profile(request,name):
    username=name
    patient=User.objects.filter(username=username)           
    consultation=Consultation.objects.filter(patient=patient[0]).order_by('-consultationdate')
    profile=Profile.objects.filter(patient=patient[0]).order_by('-daterecord')
    precription=Precription.objects.filter(consultationid=consultation)
    drugtakingtime=DrugTakingTime.objects.filter(consultationid=consultation)
    drugs=list(Drug.objects.values_list('drugname',flat=True))
    for i in range(len(profile)):
        profile[i].bodyindex['risklevel']=profile[i].risklevel()
    profiledetail=[]
    #profiledetail.append({'patient':patient})
    profiledetail.append(serializers.serialize('json',patient))
    profiledetail.append(serializers.serialize('json',profile))
    profiledetail.append(serializers.serialize('json',consultation))
    #profiledetail.append(serializers.serialize('json',drugs))
    profiledetail.append({'drugs':drugs})
    profiledetail.append({'birthday':patient[0].get_age()})
    #FOR DJANGO PAGINATOR
    # consultation_paginator = Paginator(consultation, 5)
    # consultation_page_number = request.GET.get('cpage')
    # consultation_page_obj = consultation_paginator.get_page(consultation_page_number)
    # profile_paginator = Paginator(profile, 5)
    # profile_page_number = request.GET.get('page')
    # profile_page_obj = profile_paginator.get_page(profile_page_number)
    
    return JsonResponse(profiledetail, safe=False)
    #return render(request, 'medicines/profile.html',{'cpagenumber':range(consultation_page_obj.paginator.num_pages),'pagenumber':range(profile_page_obj.paginator.num_pages),'consultation_page_obj': consultation_page_obj,'profile_page_obj': profile_page_obj,'patient':patient,'drugs':drugs,'consultations':consultation,'profiles':profile,'precriptions':precription,'drugtakingtimes':drugtakingtime})

#QUERY DATABASE BY USING THE DRUGNAME AND GET THE URL LINK AND USING THIS URL TO GET 
# THE CHINESE CONTENT USAGE
@csrf_exempt
def showdrugdetail(request):
    data = json.loads(request.body)
    drugname = data.get("drugname", "")  
    drugdetail=Drug.objects.get(drugname=drugname)
    drugdetail.drugusage=drugs_content(drugdetail.drugurl)
    #drug=[{'drugusage':drugdetail.drugusage, 'drugurl':drugdetail.drugurl}]
    drug={'drugusage':drugdetail.drugusage, 'drugurl':drugdetail.drugurl}
    #print(drug)
    return JsonResponse(drug,safe=False)

#SHOW THE PATIENT CONSULATION DETAIL 
@csrf_exempt
def showprofiledetail(request,id):
    detailobjects=[]
    consultation=Consultation.objects.filter(id=id)
    precription=Precription.objects.filter(consultationid__id=id)
    drugtakingtime=DrugTakingTime.objects.filter(consultationid__id=id)
    #drug=Drug.objects.filter(precriptiondrug__drug__isnull=False)
    drug=[drugid.drug for drugid in precription ]
    #drug=[{'drugname':drugid.drug,'drugqty':drugid.drugqty} for drugid in precription ]

    #drug=Drug.objects.filter(id=precription__drug__id)
    #drug=Precription.precriptiondrug.all()
    #return JsonResponse({'consultation':consultation,'prescription':precription,'drugtakingtime':drugtakingtime},safe=False)
    detailobjects.append(serializers.serialize('json',consultation))
    detailobjects.append(serializers.serialize('json',precription))
    detailobjects.append(serializers.serialize('json',drugtakingtime))
    detailobjects.append(serializers.serialize('json',drug))
    return JsonResponse(detailobjects, safe=False)
    return HttpResponse([consultation,precription,drugtakingtime])


# @csrf_exempt
# def showprofile(request):
#     data = json.loads(request.body)
#     patient = data.get("patient", "")   
#     profile=list(dict.fromkeys(list(Profile.objects.filter(patient__username=patient).values_list('bodyindex',flat=True).order_by('-daterecord'))))
#     print(type(profile))
#     print(profile)
#     return JsonResponse([profile[0]],safe=False)

# GET ALL THE PATIENT NAME OF THE CLINIC EXCLUDE ADMIN USER
@csrf_exempt
def patientname(request):
    patientnamelist=list(dict.fromkeys(list(User.objects.values_list('username',flat=True).exclude(username="admin"))))
    #print(patientnamelist)
    return JsonResponse(patientnamelist,safe=False)

#FOR PATIENT TO TOGGLE THE DRUG TAKING TIME AND LET THE CLINIC KNOW
@csrf_exempt
def toggledrugtakingtime(request):
    data = json.loads(request.body)
    toggledate = data.get("toggledate", "")  
    dateid = data.get("dateid","")
    #print(data)
    drugtakingtime=DrugTakingTime.objects.get(id=int(dateid))
    drugtakingtime.patienttakingtime=datetime.now()  
    drugtakingtime.save()
    return JsonResponse({'toggledate':toggledate,'dateid':dateid},safe=False)

# SAVE THE CONSULTATION DETAIL TO DATABASE
@csrf_exempt
def consultation(request):
    data = json.loads(request.body)
    print(data)
    patientusername= data.get("patient", "")
    print(patientusername)
    symptom = data.get("symptom", "")
    treatment = data.get("treatment", "")
    drugname = data.get("drugname", "")
    drugqty = data.get("drugqty", "")
    period = data.get("period", "")

    #BELOW FOR REGULAR JAVASCRIPT WITHOUT REACT
    # # print(len(request.POST))
    # print(request.POST)
    # q=request.POST
    # print(q.getlist('drugname'))
    # #print(q.lists())
    # #print(q.dict())
    # symptom = request.POST["symptom"]
    # treatment = request.POST["treatment"]
    # patientusername=request.POST["patientusername"]
    # drugqty=q.getlist("drugqty")
    # print(patientusername)
    # drugname = q.getlist('drugname')
    # print(drugname)
    # period = request.POST["period"] 

    patient=User.objects.get(username=patientusername)
    consultation=Consultation(patient=patient,symptom=symptom,treatment=treatment)
    consultation.save()
    consultationid=Consultation.objects.filter(patient__username=patientusername).order_by('-consultationdate')
    drugnameqty=len(drugname)
    for i in range(drugnameqty):
        druginstance=Drug.objects.get(drugname=drugname[i])
        precription=Precription(consultationid=consultationid[0], drug=druginstance,period=int(period),drugqty=int(drugqty[i]))
        precription.save()
    return JsonResponse({'message':'save consultation success'})
    #BELOW FOR REGULAR JAVASCRIPT WITHOUT REACT
    return HttpResponseRedirect(reverse("profile", args=[patientusername]))
    

# SAVE THE BODY INDEX TO DATABASE
# @login_required(login_url='/accounts/login/')
@csrf_exempt
def bodyindex(request,name):
    data = json.loads(request.body)
    weight = data.get("weight", "")
    height = data.get("height", "")
    Systolicblood = data.get("Systolicblood", "")
    Diastolicblood = data.get("Diastolicblood", "")
    Heartrate = data.get("Heartrate", "")
    sugar = data.get("sugar", "")
    bodyindexstr={'weight':weight, 'height':height, 'Systolicblood':Systolicblood, 'Diastolicblood':Diastolicblood,'Heartrate':Heartrate,'sugar':sugar}

    #print(bodyindexstr)
    #BELOW FOR REGULAR JAVASCRIPT WITHOUT REACT
    # weight = request.POST["weight"]
    # height = request.POST["height"]
    # Systolicblood = request.POST["Systolicblood"]
    # Diastolicblood = request.POST["Diastolicblood"] 
    # Heartrate = request.POST["Heartrate"] 
    # sugar = request.POST["sugar"] 
    # bodyindexstr={'weight':weight, 'height':height, 'Systolicblood':Systolicblood, 'Diastolicblood':Diastolicblood,'Heartrate':Heartrate,'sugar':sugar}
    #DONT NEED TO CHANGE TO JSON STR TO SAVE TO DATABASE
    #bodyindexjson=json.dumps(bodyindexstr, indent=4)  
    #bodyindexjson=json.dumps(bodyindexstr)
    #print(bodyindexjson)  
    patient=User.objects.get(username=name)           
    profile=Profile(patient=patient,bodyindex=bodyindexstr)
    profile.save()
    return JsonResponse({'message':'save bodyindex success'})
    #return HttpResponse("index")

#THIS FUNCTION IS TO GET THE DRUG CONTENT FROM THE WWW.DRUGS.COM URL USING BEAUTIFUL SOUP.
#AFTER EXTRACT THE CONTENT OF DRUGS AND IT TRANSLATE TO CHINESE USING GOOGLE TRANSLATOR AND 
#RETURN THE CHINESE TEXT
#def durgs_content(request):
def drugs_content(drugurl):
    #print(request.POST.get('drugname'))
    #with open(drugurl) as fp1:
    #BELOW IS HARD CODE HTML , CORRECT IS USING ABOVE TO GET THE CONTENT FROM CORRESPONDING WEBSITE
    with open("../medicines/drugshtml/pantoprazole.html") as fp1:
        soup = BeautifulSoup(fp1,'html.parser')
    firstuses=soup.find(id="uses")
    #print(firstuses)
    #print(firstuses.next_siblings)
    drugscontent=""
    whatistext=""
    for sibling in firstuses.next_siblings:
        #print(repr(sibling))
        if sibling.name=="h2":
            break
        else:
            if sibling!='\n':
                whatistext=whatistext+repr(sibling)
            
            #whatistext=whatistext+str(sibling)                 
    whatistext = "".join(line.strip() for line in whatistext.split("\n"))
    soup1 = BeautifulSoup(whatistext,'html.parser')
    for string in soup1.stripped_strings:
        drugscontent=drugscontent+string
    #print(drugscontent)
    #USING GOOGLE TRANSLATOR TO TRANSLATE THE DRUGS CONTENT
    translator = Translator()
    translations = translator.translate(drugscontent, dest='zh-tw')
    #print(translations.text)
    return translations.text

#READ THE FILE DRUGS.HTML CONTAINING ALL COMMON DRUGS IN WWW.DRUGS.COM AND IMPORT TO DATABASE    
#USE BEAUFIFUL SOUP TO EXTRACT DATA DRUGNAME, URL AND STORE TO DATABASE. IT IS NOT PART OF THIS
#PROGRAM, BUT NEED TO PREPARE THE DRUG DATABASE FIRST

#READ THE HTML FILE AND THEN CONVERT TO DATAFRAME AND THEN STORE TO DATABASE DIRECTLY.
def make_drug_db():
    with open("../medicines/drugshtml/drugs.html") as fp:
        soup = BeautifulSoup(fp,'html.parser')
    litag=soup.li.a
    litag1=soup.find_all('li')

    drugs=[]
    drugname=[]
    drugurl=[]
    for i in range(len(litag1)):
        #print(litag1[i].a.string)
        drugs.append(litag1[i].a.string)
        drugname.append(litag1[i].a.string)
        drugurl.append("https://www.drugs.com"+litag1[i].a['href'])
    data ={'drugname':drugname,'drugurl':drugurl}
    drugpd=pd.DataFrame.from_dict(data)
    drugpd.reset_index(drop=True)
    #print(len(drugs))
    conn = sql.connect('db.sqlite3')
    #drugpd.to_sql('medicines_drug', conn, if_exists='append', index=False )
    readpd=pd.read_sql('select * from medicines_drug',conn)

#THE REGISTER FUNCTION IS NOT USING BUILT IN DJANGO AS DJANGO HAS LOGIN AND LOGOUT TEMPLATE ONLY.
#WE USE DJANGO BUILT IN LOGIN AND LOGOUT VIEW AND SO THIS PROGRAM DONT HAVE THESE VIEWS.

def register(request):
    if request.method == "POST":
        registerform=CustomUserCreationForm(request.POST)
        # print(validate_password(registerform['password1']))
        #BELOW IS USED DJANGO BUILT IN VALIDATE PASSWORD TO CHECK USER REGISTER PASSWORD SIMPLE OR NOT
        # if validate_password(registerform['password1']) is None:
        #     User.set_password(registerform['password1'])
        print(registerform)
        if registerform.is_valid():
            user=registerform.save()
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            print(registerform.errors)
            return render(request, "medicines/register.html", {
                "message": registerform.errors,'registerform':registerform
            })
    else:
        
        registerform=CustomUserCreationForm()
        print(registerform)
        return render(request, "medicines/register.html",{'registerform':registerform})
