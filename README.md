# Videolozy.in — Film Editor Portfolio Web App

Full-stack web application for a film editor to showcase work and accept inquiries.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Flask, Flask-JWT-Extended, Flask-CORS, SQLAlchemy, Flask-Migrate |
| Database | NeonDB (PostgreSQL) |
| Media | Cloudinary |
| Frontend | React + Vite, Tailwind CSS, React Router, Axios |
| Auth | JWT in localStorage |

---

## Project Structure

```
Videolozy.in/
├── backend/
│   ├── app/
│   │   ├── __init__.py        # Flask app factory
│   │   ├── config.py          # Config from env
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routes/
│   │   │   ├── public.py      # Public API
│   │   │   └── admin.py       # Admin API (JWT)
│   │   └── utils/
│   │       └── cloudinary_helper.py
│   ├── seed.py                # Seed admin + settings
│   ├── run.py                 # Dev server entry
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── public/        # Home, Portfolio, Detail, About, Contact
    │   │   └── admin/         # Login, Dashboard, Projects, Inquiries, Settings
    │   ├── components/        # Navbar, Footer, ProjectCard, etc.
    │   ├── context/           # AuthContext (JWT)
    │   └── services/          # Axios API client
    └── .env.example
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env from template
copy .env.example .env
# Then fill in DATABASE_URL, Cloudinary keys, JWT_SECRET_KEY, etc.

# Run database migrations
flask --app run db init
flask --app run db migrate -m "initial"
flask --app run db upgrade

# Seed admin user and default settings
python seed.py

# Start dev server
python run.py
```

**Backend runs at:** `http://localhost:5000`

### 2. Frontend

```bash
cd frontend

# Create .env from template
copy .env.example .env
# Set VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Install dependencies (already done)
npm install

# Start dev server
npm run dev
```

**Frontend runs at:** `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET_KEY=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123
ADMIN_EMAIL=admin@videolozy.in
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## API Reference

### Public Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List projects (`?category=` filter) |
| GET | `/api/projects/<id>` | Project detail |
| GET | `/api/site-settings` | Site settings |
| POST | `/api/contact` | Submit inquiry |

### Admin Endpoints (JWT Required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Get JWT token |
| GET | `/api/admin/dashboard` | Stats |
| GET/POST | `/api/admin/projects` | List / Create |
| GET/PUT/DELETE | `/api/admin/projects/<id>` | Detail / Update / Delete |
| GET | `/api/admin/inquiries` | All inquiries |
| PATCH | `/api/admin/inquiries/<id>` | Update status |
| DELETE | `/api/admin/inquiries/<id>` | Delete inquiry |
| GET/PUT | `/api/admin/settings` | View/Update settings |
| POST | `/api/admin/upload` | Upload to Cloudinary |

---

## Deployment

### Backend (Render / Railway)
- Set environment variables in the platform dashboard
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn run:app`
- Run migrations: `flask --app run db upgrade` (add as a pre-deploy command)

### Frontend (Vercel / Netlify)
- Root: `frontend/`
- Build command: `npm run build`
- Output directory: `dist/`
- Set `VITE_API_BASE_URL` to your deployed backend URL
- Set `VITE_CLOUDINARY_CLOUD_NAME`

> **Important:** Update `FRONTEND_ORIGIN` in the backend env to match your deployed Vercel/Netlify URL for CORS.
