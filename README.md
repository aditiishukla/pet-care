# PetCare

PetCare is a veterinary appointment and pet healthcare platform for pet owners. Authentication for pet owners is working. Pets, doctors, appointments, the AI assistant, maps, and the health library are not built yet.

## Phase 1 objectives

- Create the React (Vite) frontend and the Express backend.
- Install the core dependencies.
- Connect to MongoDB.
- Confirm the React app can call an Express test endpoint.

## Technology stack

**Frontend:** React, Vite, JavaScript (JSX), Tailwind CSS, React Router DOM, Axios, Lucide React

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors, express-validator

Google Gemini and Leaflet are planned for later phases and are not installed yet.

## Folder structure

```
petcare/
├── frontend/src/
│   ├── components/    Navbar, protected route, loading spinner
│   ├── context/       AuthContext
│   ├── pages/         Home, Login, Register, Dashboard
│   └── services/      Axios client and auth requests
├── backend/
│   ├── models/User.js
│   ├── controllers/authController.js
│   ├── routes/authRoutes.js
│   ├── middleware/    JWT check and error handler
│   └── server.js
└── README.md
```

## API

| Method | Endpoint            | Auth | Purpose                                      |
| ------ | ------------------- | ---- | -------------------------------------------- |
| GET    | /api/health         | No   | Returns API status and MongoDB connection state |
| POST   | /api/auth/register  | No   | Creates a pet owner and returns a JWT        |
| POST   | /api/auth/login     | No   | Checks email and password, returns a JWT     |
| GET    | /api/auth/me        | Yes  | Returns the signed-in user                   |

Example response:

```json
{
  "success": true,
  "message": "PetCare API is running",
  "database": "connected"
}
```

`database` is `disconnected` when MongoDB is not running or `MONGO_URI` is wrong. The HTTP server still starts so the frontend can show that status.

## Environment variables

Copy the examples and fill in your own values. Do not commit `.env` files.

**backend/.env**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

For a local MongoDB install, `MONGO_URI` is often:

```
mongodb://127.0.0.1:27017/petcare
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5000/api
```

A local `.env` is already created for development with that local MongoDB address. It is listed in `.gitignore`.

## How to run

MongoDB should be running locally, or `MONGO_URI` should point at your database.

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend** (second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The home page calls `GET /api/health` and shows whether the API and MongoDB are reachable.

Open `http://localhost:5173`. Register a pet owner, then open the dashboard. The token is stored in the browser, so a refresh stays logged in. `/dashboard` redirects to login when there is no session.

Passwords are hashed with bcryptjs before they are saved. Private routes expect `Authorization: Bearer <token>`.

## What the main files do

- `backend/models/User.js` — pet owner fields and password hashing on save.
- `backend/controllers/authController.js` — register, login, and current user.
- `backend/routes/authRoutes.js` — validation rules and auth paths.
- `backend/middleware/authMiddleware.js` — checks the JWT and loads the user.
- `backend/utils/generateToken.js` — signs a token that expires in 7 days.
- `frontend/src/context/AuthContext.jsx` — login state, including restore after refresh.
- `frontend/src/components/ProtectedRoute.jsx` — sends guests to the login page.

## Next phase

Phase 3 is pet profiles: add, view, edit, and delete pets that belong to the signed-in owner.
