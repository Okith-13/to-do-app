# Task — Full-Stack To-Do App

A production-ready, full-stack to-do list application built with **React**, **Node.js/Express**, and **MongoDB**.

## Features

- 🔐 **Authentication** — Register & login with JWT tokens
- ✅ **Full CRUD** — Create, read, update, delete tasks
- 🎯 **Priorities** — High, Medium, Low task priorities
- 📅 **Due Dates** — Set due dates with overdue detection
- 🏷️ **Tags** — Organize tasks with custom tags
- 🔍 **Filters** — Filter by status and priority
- 📊 **Stats** — Progress bar and task statistics
- 📱 **Responsive** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Query, React Router, CSS Modules |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |

## Project Structure

```
todo-app/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── server.js        # Entry point
│   └── .env.example
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/         # Axios API calls
│       ├── components/  # Reusable components
│       ├── context/     # React context (Auth)
│       └── pages/       # Route pages
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone (https://github.com/Okith-13/to-do-app.git)
cd to-do-app
```

### 2. Setup the backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Setup the frontend
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env if your backend runs on a different port
npm start
```

The app will be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Todos (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos (filterable) |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo |
| PATCH | `/api/todos/:id/toggle` | Toggle completion |
| DELETE | `/api/todos/:id` | Delete a todo |
| GET | `/api/todos/stats` | Get stats |

## Query Parameters (GET /api/todos)
- `completed=true|false` — filter by status
- `priority=high|medium|low` — filter by priority
- `tag=tagname` — filter by tag
- `sort=-createdAt` — sort field (default: newest first)

## Deployment

### Backend (e.g. Railway, Render)
Set env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`

### Frontend (e.g. Vercel, Netlify)
Set env var: `REACT_APP_API_URL=https://your-backend-url.com/api`
