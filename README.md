# LibraSphere LMS

A Library Management System built with Django for backend, React for frontend, and Supabase for the database.

## Project structure

```
LibraSphere/
│── backend/                    # Django project
│   │─ .dockerignore
│   │─ .env.example             # Environment example for backend
│   │─ dev-requirements.txt     # For development
│   │─ Dockerfile       
│   │─ requirements.txt         # For deployment
│── frontend/                   # React app
│   │─ .dockerignore
│   │─ .env.development.example # Environment example for frontend
│   │─ Dockerfile       
│── venv/                       # Python virtual environment (not pushed to GitHub)
│── .gitignore
│── compose.yaml                # Docker compose file
│── LIBBY_PLAN.md
│── README.md
```

## FEATURES

### User
- Browse books
- Search books
- Borrow books

### Admin
- Add books
- Edit books
- Approve borrowing requests
- Process book returns
- View borrower logs

## PREREQUISITES

### For manual setup
**Frontend:**
* Node.js 22+
* npm

**Backend:**
* Python 3.13+
* pip

### For docker
* Docker Desktop
* WSL2 (For windows only)

>Link for installation guide: [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install#wsl-verification-and-setup)
---

## SETUP INSTRUCTIONS

### Clone repo

```
git clone https://github.com/Qutiepatutie/LibraSphere.git
cd LibraSphere
```

### Configure environment variables

Create the required `.env` files for both backend and frontend before starting the project.

- `backend/.env`
- `frontend/.env.development`

>See `.example` files for required fields, then fill in the values.

### Docker setup
> The following commands manage both the backend and frontend containers. Run them from the project root directory.

**Start the containers:**

```bash
docker compose up
```
> If you modify a Dockerfile or install new dependencies (like updating `dev-requirements.txt` or `package.json`), rebuild the images:
```bash
docker compose up --build
```

**Stop the containers:**
```bash
docker compose down
```

### Manual setup

#### Setup venv

> Optional, but recommended.

```bash
python -m venv venv
venv\Scripts\activate   # To run venv
venv\Scripts\deactivate # To close venv
```

#### Backend

> From project root directory ( /LibraSphere ).

```bash
cd backend
pip install -r dev-requirements.txt

# If you're connecting to a new database:
python manage.py migrate

python manage.py runserver
```

#### Frontend

> From project root directory ( /LibraSphere ).

```bash
cd frontend
npm install
npm run dev
```

## Development URLs

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://127.0.0.1:8000](http://127.0.0.1:8000)