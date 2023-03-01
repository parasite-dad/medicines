# Medicines Tracking
## Demo
https://medicines.onrender.com

## Background
 In Hong Kong, there is no system to know our previous medical consultation history centrally. Each clinic or data cannot share easily with each other as most of time clinic still use paper record card to write patient consultation record. If a patient want to go to see new doctor, the new doctor don't have previous patient history health record. Those data in fact are belong to patient and it is personal private data. Patient cannot easily know previous consultation even it is in hosptial. With this web application, it is helpful for patient to view previous consultation, body health index history, previous drugs taken and can sent their body health index to health care centre in need. For the clinic or hospital points of views, they can remind patient to take drugs on time, monitor their body health index easily. This app is for both clinic doctor and patient to communicate easily and store patient whole life record.

Also, patient ususally did not know the drugs usage exactly and it is easily to have more information of this web app the link and usage of drug. Also, it can be translated to Chinese for elderly who dont know english.

This application is very basic one with core function but the idea can be easily extended to many differnt ideas. We can connect body index record using smart watch, some smart health device to record automatically daily health and sent to healthcare or Doctor easily. On the Doctor or clinic points of view, they can know the patient health easily day by day. and they can have centralized database to have all patient record easily finding some discease trend. For the health care company or durg company, they can have these data and easily promote their health products to corresponding patients. Furthermore, we can added some simple input device to capture patience taking drugs time. Let's say a electronic device button pressed after drug taking.

---
## Distinctiveness and Complexity
This web application is different from previous project in the folllowing
1. previous project is like 'many to many' struture, that is many post or many commerce product to many people. However, this medicines project structure is like 'one to many'. That is one clinic admin to many patients. Each clinic acts as admin with his own interface and function while patients have their own interface and functions too. So this project has like two interface for clinic and for patient.
2. using the following tools to built the project
    - Beautiful Soup (grab the drug detail and url from drugs.com)
    - Google Tranlator (translate all english drug content to chinese for elderly)
    - React JS (frontend tool to built up this app and reused components) 
    - Integration javascript package inside django project (Frontend is ReactJS and Backend is Django)
    - Deeper in Django function like Authentication , Builtin Form, Builtin View, builtin login and so on

---
## Project File Structure
- capstone
    - capstone (main project)
    - medicines (main app)
        - migrations (django)
        - src
            - index.js (main container of reactjs)
            - components (different component)
                - Adminbodyindexhistory.js
                - App.js (main controlling flow)
                - Bodyindex.js (bodyindex form)
                - Bodyindexhistory.js (bodyhistory table)
                - Consulation.js (consultation form)
                - Consultationdetails.js (consultation detail)
                - Consultationhistory.js (consultation table)
                - Drugdetail.js (drug url and detail usage)
                - Patientmedicinestracking.js (patient drug taking)
        - static/medicines 
            - main.js (reactjs generate file)
            - main.js.LICENSE.txt (reactjs)
            - patientname.js    (show all patient in layout select box)
            - styles.css 
        - templates/medicines
            - index.html (main index file)
            - layout.html (top layout tab)
            - login.html (login )
            - register.html (register)
        - _init_.py (virtual env)
        - admin.py (django)
        - apps.py (django)
        - babel.config.json (babel for JSX)
        - forms.py (django builtin form)
        - models.py (django model)
        - package-lock.json (javascript package file)
        - package.json (javascript package file)
        - tests.py (django tests)
        - urls.py (django urls)
        - views.py (django views)
        - webpack.config.js (webpack file makeing all js component to single main.js)
    - drugshtml (drusg.com html medicines name)
    - staticfiles (using whitenoise)
    - db.sqlite3 (sqlite database)
    - manage.py (django)
    - requirements.txt (pip dependanies)
    - README.md
        

---
## Functions
- Clinic Part
    -  Admin Main Page
        -monitor all patients with drug taking yesterday or not and bodyindex from patient yesterday submitted
    -  Profile Page
        - showing individual patient consultation and bodyindex history
        - making consultation with patient and record pills given to patient

- Patient Part
    - showing all consultation history record and bodyindex record
    - submit the bodyindex to clinic 
    - trigger daily drug button after drug taking so that clinic know each patient taking drug on time and quantity remaining
    - remind patient to take drugs if he did not take yesterday
    - get more information of the drugs take in URL and usage and translate to Chinese

---
## How to run and interface
1. git clone https://github.com/parasite-dad/medicines.git
2. cd medicines
3. python -m venv .
4. source bin/activate
5. pip install -r requirements.txt
6. gunicorn capstone.wsgi

- for both admin or patient, if it is not login before, it will direct to login page.
depends on the admin or patience login and will redirect to admin page or patient page.

1. Login page
![Login](/medicines/static/medicines/login.png)

2. Register page
![Register](/medicines/static/medicines/register.png)

3. Admin page
![Admin](/medicines/static/medicines/admin.png)

3. Profile page
![Profile](/medicines/static/medicines/profile.png)

3. Patient page
![Patient](/medicines/static/medicines/patient.png)
## Datebase model
- User (table for admin and patience information)
- Profile (table for body index indicator)
- Consultation (table for consulation record)
- Precription (table for the drugs for each consultation)
- Drugtakingtime (table to record time taking by patience)
- Drug (all drug information database)

---
## Limitation
- Only limited to one clinic
- bodyindex is limited input choice and can be extend to much more bodyindex 
- drug database is limited
- cannot connect smart device
- no other language of translation except Chinese
- can have more function for elderly like speaker / alarm device to remind drug taking
- can have translator in other language for the drug usage and side effects

---
## Futher development
- multiple clinic
- bodyindex link up to smart device to get other data
- promote health product depends on the health body index of patience
- Can built a message systme to communicate with clinic
- bodyindex database can be analayic with other patient data big data to know any hidden health problem too

---
## Reference
1. https://www.drugs.com/
2. https://www.reactjs.org
3. https://babeljs.io/
4. https://webpack.js.org/
5. https://github.com/ssut/py-googletrans
6. https://docs.djangoproject.com/en/4.1/topics/serialization/
7. https://docs.djangoproject.com/en/4.1/topics/signals/
8. https://docs.djangoproject.com/en/4.1/ref/forms/widgets/
9. https://docs.djangoproject.com/en/4.1/topics/auth/
10. https://docs.djangoproject.com/en/4.1/topics/forms/modelforms/
11. https://www.django-rest-framework.org/
12. https://www.npmjs.com/package/react-paginate
---
## Things to learn
1. React Js integrated with exisiting django system and basic React Js library props and state, JSX, frontend framework
2. Separation of frontend and backend 
3. Deeper function of django like authentication, forms, built in view, built in login/logout
    - https://docs.djangoproject.com/en/4.1/topics/serialization/
4. Beautiful soup
5. Google Translator
6. JSX babel
7. Webpack
8. Reuse of components of Reactjs 
9. Pageination using react


