# 🚀 MERN User Management System

A full-stack MERN application with TypeScript, providing a modern User Management Dashboard.
Includes CRUD operations, pagination, sorting, role/status filtering, and responsive UI with React-Bootstrap.

# 📂 Project Structure
## Backend (/backend-api)

## src/
 ┣ controllers/     # Business logic for users
 ┣ models/          # User schema/model
 ┣ routes/          # Express routes
 ┣ services/        # Reusable services (DB, API, etc.)
 ┣ server.ts        # Entry point
 ┣ db.json          # JSON Server / mock data
 ┣ package.json
 ┣ .env

## Frontend (/frontend)

## src/
 ┣ infrastructure/
 ┃ ┣ api/api.ts       # API calls (axios)
 ┃ ┣ routes.ts        # App routes
 ┃ ┣ http.ts          # Axios client setup
 ┃ ┗ model/userModel.ts
 ┣ presentation/
 ┃ ┗ components/
 ┃   ┣ UsersData.tsx       # Table view with pagination, filters, actions
 ┃   ┣ CreateAndEditForm.tsx # Form for create/edit user
 ┃   ┣ UserData.tsx        # Single user detail view
 ┣ App.tsx
 ┣ index.tsx
 ┣ .env


# ✨ Features

# ✅ Backend (Node.js + Express + TypeScript)

RESTful APIs for user CRUD

JSON-server (or MongoDB) for persistence

Environment variable support

# ✅ Frontend (React + TypeScript + Bootstrap)

Responsive dashboard layout

CRUD Operations: Create, Read, Update, Delete users

Search (by name/email)

Multi-filter: Role & Status

Sorting (by name/email)

Pagination (10 per page, configurable)

Confirmation Modals for deletes

Inline form validation with error messages

Toast Notifications (success/error)

# ⚙️ Installation
# 1️⃣ Backend Setup

cd backend-api
npm install
npm run dev

# 2️⃣ Frontend Setup and create project
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# dependencies
npm install react-router-dom@6 axios @reduxjs/toolkit react-redux formik yup react-toastify json-server
# optional UI / table helpers
npm install @mui/material @emotion/react @emotion/styled
# dev/test
npm install -D jest @testing-library/react @testing-library/jest-dom msw


npm run dev for backend and frontend
backend run at port 4000
frontend run at port 5173 (http://localhost:5173/)


## Demo Video 🎥

[Watch the demo video](https://raw.githubusercontent.com/praveenmethraskar/User-management/main/task.mp4)
