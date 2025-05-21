# Full Stack Blog App (Django + React + SQLite)

This is a full-stack web application built with:

* **Backend:** Django + Django REST Framework + SQLite
* **Frontend:** React + Tailwind CSS
* **Authentication:** Django's built-in auth system
* **Routing:** React Router v6

---

## 🔧 Project Structure

```
/backend     # Django project (REST API)
/frontend    # React app (UI)
/README.md   # You're here
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

## 💽 Backend Setup (Django + DRF)

### Step 1: Create and activate a virtual environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
```

### Step 2: Install dependencies

```bash
pip install -r requirements.txt
```

> Make sure `djangorestframework` is in your `requirements.txt`

### Step 3: Apply migrations and run server

```bash
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

---

## 🌐 Frontend Setup (React)

### Step 1: Navigate to frontend

```bash
cd ../frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Run the development server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Authentication

* The backend uses Django's built-in authentication system.
* You can register, log in, and create posts.
* Auth tokens (or JWT) are stored in cookies for session handling.

---

## 📚 Frontend Routes

The frontend uses React Router for navigation:


### 🔒 Route Guards

* `<ProtectedRoute>`: For authenticated users (e.g. Add Post)
* `<AuthRoute>`: For guests only (e.g. Login/Register)

---

## 💠 Technologies Used

* Django
* Django REST Framework
* React
* Tailwind CSS
* SQLite
* React Router
* js-cookie

---

## ✅ Features

* User registration & login (Django auth)
* Auth-protected routes (React)
* Post creation (only for logged-in users)
* 404 Not Found route
* Responsive layout


## 📄 License

This project is licensed under the MIT License.

