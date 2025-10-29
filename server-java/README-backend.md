# Java JDBC Backend (Javalin) — Quick Start

This lightweight Java backend demonstrates a JDBC connection to PostgreSQL and provides two endpoints used by the React frontend:

- POST /api/register — register a new user (username, email, password)
- POST /api/login — login using email and password

Prerequisites
- Java 17+
- Maven
- A running PostgreSQL database

Setup
1. Copy `server-java/.env.example` to a local env file or set environment variables (DB_URL, DB_USER, DB_PASSWORD, PORT).
2. Create the `users` table in your PostgreSQL database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table to store user quest progress (one row per user+quest)
CREATE TABLE quest_progress (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  quest_id TEXT NOT NULL,
  progress NUMERIC,
  data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (email, quest_id)
);
```

Run backend (from repository root):

```powershell
cd server-java
mvn compile exec:java
```

The backend will start on the port from `PORT` env var (default 7000).

Frontend
The React app was updated to call `http://localhost:7000/api/...` by default. You can change the base URL by setting `VITE_API_BASE_URL` in your frontend `.env` file.
