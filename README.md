# TechWithTech 🚀
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

> **"Connecting Tech with Future Techies"**

Hi! I'm **Arya**, and this is my latest full-stack project. I built **TechWithTech** to solve a real-world problem while mastering modern web development.

We are the bridge connecting cutting-edge software companies directly with schools. We facilitate the donation of vital resources (computers, lab equipment, books) to empower the next generation of innovators.

## 🔴 Live Demo
The project is currently deployed on AWS:
**[View Live Application](http://56.228.82.244/)**

---

## ✨ Key Features

* **🔐 Role-Based Access Control:** Distinct portals for **Schools** (requesters) and **Companies** (donors).
* **📝 Request Management:** Schools can post detailed requirements for specific infrastructure.
* **🤝 Donation Matching:** Companies can browse active requests and pledge donations immediately.
* **✅ Verification System:** Workflow to verify school credentials before requests go live.
* **📊 Dashboard Analytics:** Track total donations, pending requests, and impact metrics.

---

## 🛠️ Tech Stack

### Backend
* **Language:** Python 3.9+
* **Framework:** [FastAPI](https://fastapi.tiangolo.com/) - High-performance, asynchronous REST APIs.
* **Database:** PostgreSQL - Relational database for structured data.
* **ORM:** SQLAlchemy - ORM for Python.

### Frontend
* **Framework:** [React.js](https://react.dev/)
* **Styling:** CSS Modules.
* **HTTP Client:** Axios/Fetch.

---

## 📂 Project Structure

Unlike standard setups, I organized the backend logic into a dedicated `App` package to keep the root clean.

```bash
TechWithTech/
├── App/                 # FastAPI Application Package
│   ├── __init__.py
│   ├── database.py      # Database connection & Session
│   ├── models.py        # SQLAlchemy Models
│   ├── schemas.py       # Pydantic Models
│   ├── crud.py          # Database Operations
│   └── main.py          # Entry point & API routes
│
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── assets/      # Static files
│   │   ├── components/  # UI Components
│   │   ├── pages/       # Page Views
│   │   └── api.js       # API Configurations
│   ├── package.json
│   └── .env             # Frontend Config
│
├── venv/                # Virtual Environment
├── requirements.txt     # Backend Dependencies
├── reset_db.py          # DB Utility Script
└── README.md

```

---

## ⚡ Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

* Node.js & npm installed
* Python 3.9+ installed
* PostgreSQL installed and running

### 1. Clone the Repository

```bash
git clone https://github.com/arya0210/TechWithTech.git
cd TechWithTech

```

### 2. Backend Setup

**Create and Activate Virtual Environment:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

```

**Install Dependencies:**

```bash
pip install -r requirements.txt

```

**Configure Environment Variables:**
Create a `.env` file in the **root** folder (`TechWithTech/.env`) and add your database credentials:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost/techwithtech_db
SECRET_KEY=supersecretkey

```

**Run the Server:**
⚠️ **Important:** Because the code is in the `App/` folder, you must run the command from the **root** directory.
Correct: TechWithTech> uvicorn App.main:app --reload
Incorrect: TechWithTech\App> uvicorn main:app --reload

```bash
# Run this from the root "TechWithTech" folder
uvicorn App.main:app --reload

```

* API runs at: `http://localhost:8000`
* Docs run at: `http://localhost:8000/docs`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder.

```bash
cd frontend

```

**Install Dependencies:**

```bash
npm install

```

**Configure Environment:**
Create a `.env` file in `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000

```

**Start the React App:**

```bash
npm start

```

* App runs at: `http://localhost:3000`

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| `POST` | `/signup` | Register a new user (School or Company) |
| `POST` | `/login` | Authenticate user and receive access token |
| `POST` | `/forgot-password/temp` | Initiate password recovery (Temporary) |
| `POST` | `/forgot-password/otp` | Send OTP for password recovery |
| `POST` | `/reset-password/verify` | Verify OTP and reset password |
| **Requests** | | |
| `POST` | `/requests/create` | Submit a new equipment requirement (School) |
| `GET` | `/requests/{party_id}` | View requests for a specific user/school |
| **Donations** | | |
| `POST` | `/donations/create` | Pledge a new donation item (Company) |
| `GET` | `/donations/{party_id}` | View donations made by a specific company |
| `GET` | `/donations/available` | List all unmatched/available donations |
| **Matching** | | |
| `GET` | `/matches/donations/{item_type}` | Find donations matching a specific item type |
| `GET` | `/matches/requests/{item_type}` | Find requests matching a specific item type |
| `POST` | `/transact/match` | Execute a match to finalize a donation |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Arya**

* **GitHub:** https://github.com/arya0210
* **Email:** vardhanarya97@gmail.com

```
