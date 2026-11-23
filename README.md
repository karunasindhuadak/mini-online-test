# Mini Online Test App

A full-stack MERN application for taking online multiple-choice quizzes. It has user authentication, timed tests, instant results, test history, and an admin panel for managing questions.

## Features

- Sign up / login with JWT authentication and protected routes
- 10 MCQ questions per test with a 10-minute countdown timer
- Auto-submits when time runs out
- Instant results with score and detailed answer review (green for correct, red for wrong)
- Test history — view all past attempts and click any to see details
- Admin panel — add or delete questions (admin-only)
- Responsive UI with Tailwind CSS

## Project Structure

```
mini-online-test/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── api/          # Axios instance
│   │   ├── components/   # Navbar, Timer, QuestionCard, ProtectedRoute
│   │   ├── context/      # AuthContext
│   │   └── pages/        # Login, Register, Dashboard, TestPage, ResultPage, History, AdminPanel
│   ├── .env.example
│   └── package.json
├── server/               # Express backend
│   ├── config/           # MongoDB connection
│   ├── middleware/        # JWT auth middleware
│   ├── models/           # User, Question, TestAttempt
│   ├── routes/           # auth, questions, tests
│   ├── seed.js           # Database seeder (25 questions + demo users)
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- npm

## Setup

### 1. Configure environment variables

**Server** — create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net?retryWrites=true&w=majority
JWT_SECRET=any-long-random-string
CORS_ORIGIN=http://localhost:5173
```

**Client** — create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Seed the database

```bash
cd server
npm run seed
```

This creates 25 sample questions and two demo users:
- Admin: admin@test.com / admin123
- Student: student@test.com / student123

To reset all data: `npm run seed -- --clear`

### 4. Run the app

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Then open http://localhost:5173.

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/auth/me` — Get current user (requires token)
- `GET /api/questions` — Get 10 random questions (requires token)
- `POST /api/questions` — Add a question (admin only)
- `DELETE /api/questions/:id` — Delete a question (admin only)
- `POST /api/tests/submit` — Submit test answers (requires token)
- `GET /api/tests/history` — Get user's test history (requires token)
- `GET /api/tests/:id` — Get specific test attempt details (requires token)

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcrypt
