# Bookly LMS

## Project structure

```
bookly-lms/
│── backend/    # Django project
│── frontend/   # React app
│── venv/       # Python virtual environment (not pushed to GitHub)
│── .gitignore
│── README.md
│── requirements.txt
```

## SETUP INSTRUCTIONS

> **Note**: Empty directories have ".gitkeep" files in them, you can delete it once you add actual files in the folder

### 1. Clone repo

```
git clone https://github.com/Qutiepatutie/LibraSphere.git
cd bookly-lms
```

### 2. Setup backend

#### Setup venv
> (You can skip this)

```
python -m venv venv
venv\Scripts\activate # to activate venv
```

#### Install dependencies

```
pip install -r requirements.txt
```

#### Run migrations on Django

```
cd backend
python manage.py migrate
```

#### Start backend server

```
python manage.py runserver
```

### 3. Setup frontend

```
cd frontend
npm install
npm run dev
```
