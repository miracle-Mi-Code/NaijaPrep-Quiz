# NaijaPrep - E-Learning Quiz Platform

A mobile-first, responsive E-Learning Quiz Platform built specifically for Nigerian secondary and tertiary students preparing for standard examinations such as **JAMB/UTME**, **WAEC**, and **Post-UTME**.

Students can take timed practice quizzes, receive instant server-evaluated scores, and track their historical performance over time.

---

## Tech Stack Overview

- **Frontend**: React (Vite) + Tailwind CSS (Mobile-first design system with dark mode glassmorphism).
- **Backend**: Node.js + Express.js (REST API architecture).
- **Database**: PostgreSQL (raw `pg` pool driver with parameterized queries).
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing.
- **Deployment Ready**: Designed for Vercel/Netlify (Frontend) and Render/Fly.io (Backend & PostgreSQL DB).

---

## Core Features & System Capabilities

1. **Authentication**: Secure registration and login with encrypted passwords and JWT token persistence.
2. **Subject Categorization**: Categorized practice quizzes for Nigerian secondary subjects (Mathematics, English, etc.).
3. **Timed Exam Session**: Countdown timer hook (`useQuizTimer`) with real-time progress tracking and auto-submit upon timer expiration.
4. **Server-Side Evaluation**: Correct answers are securely hidden from client during quiz execution and evaluated exclusively on the backend upon submission.
5. **Detailed Review & Dashboard**: Visual breakdown showing score, percentage, correct answer comparisons, and overall average metrics.

---

## Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Database Setup
Create a local PostgreSQL database named `e_learning_app` and seed the tables:

```bash
# Create database
createdb e_learning_app

# Run Schema DDL
psql -d e_learning_app -f database/schema.sql

# Run Seed Data (Mathematics & English Quizzes with 5 questions each)
psql -d e_learning_app -f database/seed.sql
```

---

### 2. Backend Setup
Navigate into `backend/`, install dependencies, set up environment variables, and start the development server:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/e_learning_app
JWT_SECRET=naijaprep_super_secret_jwt_key_2026
```

Start the API server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

---

### 3. Frontend Setup
Navigate into `frontend/`, install dependencies, set up environment variables, and start Vite dev server:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the React dev server:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Deployment Guidelines

### 1. Backend & Database Deployment (Render / Fly.io)
1. **Managed PostgreSQL**: Provision a free PostgreSQL instance on Render, ElephantSQL, or Neon.
2. Run `database/schema.sql` and `database/seed.sql` against your production database instance using `psql` or the web SQL runner.
3. **Web Service**: Create a Node.js Web Service connected to your repository `backend` folder.
4. Configure Production Environment Variables:
   - `DATABASE_URL`: `postgres://<user>:<password>@<host>:<port>/<dbname>`
   - `JWT_SECRET`: A strong, randomly generated string.
   - `NODE_ENV`: `production`
5. Build & Start Command:
   - Build: `npm install`
   - Start: `node src/index.js`

### 2. Frontend Deployment (Vercel / Netlify)
1. Connect your repository to Vercel or Netlify.
2. Set Root Directory to `frontend`.
3. Configure Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-render-app.onrender.com/api`
5. Deploy!

---

## 2–3 Minute Demo Video Script

**Title**: *NaijaPrep E-Learning Quiz Platform Walkthrough*  
**Duration**: 2:30  
**Target Audience**: Students, Educators, and Evaluators

### Script Breakdown

#### **0:00 – 0:30 | Introduction & Problem Statement**
- *"Hello everyone! Secondary and tertiary students in Nigeria often lack accessible, localized practice tools for standard examinations like JAMB/UTME, WAEC, and Post-UTME."*
- *"Welcome to **NaijaPrep**, a lightweight, mobile-responsive E-Learning Quiz Platform built with React, Node.js, Express, and PostgreSQL."*

#### **0:30 – 1:00 | User Authentication & Registration**
- *"Let's begin on the home screen. New students can register with their username, email, and password. Existing students log in securely via JWT authentication."*
- *(Action: Click 'Sign Up', create a test account, and land on the Student Dashboard).*

#### **1:00 – 1:45 | Dashboard & Timed Quiz Session**
- *"On the Dashboard, students see their performance metrics—completed quizzes, average score, and past attempt history."*
- *"Notice the available practice quizzes grouped by subjects like **Mathematics** and **English**."*
- *"Let's select 'JAMB Mathematics Foundation'. Notice the sticky session timer countdown at the top with a live progress bar. Answers are selected via intuitive A–D radio buttons."*
- *(Action: Select answers for all 5 math questions and click 'Submit Quiz Answers').*

#### **1:45 – 2:15 | Instant Results & Detailed Review**
- *"Upon submission, answers are evaluated server-side to guarantee integrity. The client receives a full breakdown: total score, percentage badge, and question-by-question review showing the student's answer vs. the correct answer."*
- *"Returning to the dashboard, our performance stats and attempt history update instantly!"*

#### **2:15 – 2:30 | Conclusion & Deployment Summary**
- *"NaijaPrep is production-ready for deployment on Vercel and Render with PostgreSQL. Thank you for watching!"*

---

## License
MIT License. Open source for educational use.
