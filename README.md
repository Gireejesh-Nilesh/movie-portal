# Movie Platform

Live Demo: https://cinepulse-welcome.onrender.com/

Movie Platform is a full-stack web application for discovering movies, TV shows, and popular people, with secure authentication, personalized user activity, and an admin dashboard. The project is built with a modular React frontend and an Express + MongoDB backend, and it was validated with concurrent load testing on the deployed Render instance.

## Overview

This project was built to demonstrate:

- full-stack architecture
- secure user authentication and authorization
- state management at scale
- API integration with external media data
- personalized features such as favorites and watch history
- admin-level catalog and user management
- performance validation through load testing

## Key Features

### Public Features

- Discover trending content on the home page
- Browse popular movies, TV shows, and people
- Search movies, TV shows, and people with debounced real-time search
- View movie details, TV details, trailers, and person profiles
- Infinite scrolling and progressive content loading
- Rich cinematic UI with animated sections and route transitions

### User Features

- Signup and login with secure authentication
- JWT-based authentication stored in HTTP-only cookies
- Protected dashboard for logged-in users
- Add movies or TV shows to favorites
- Automatically track watch history when viewing details
- Remove favorites and history items
- Clear watch history
- Search within dashboard favorites and history

### Admin Features

- Role-based admin-only route protection
- Manage custom admin catalog entries
- View all users
- Ban and unban users
- View platform statistics
- Delete catalog entries

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS v4
- Redux Toolkit
- React Redux
- React Router DOM
- Axios

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- cors
- zod

### External Integration

- TMDB API for movies, TV shows, people, details, and trailers

### Load Testing

- k6

## Architecture

The application follows a separated frontend/backend architecture.

### Frontend Architecture

The frontend is organized into:

- `pages` for route-level screens
- `components` for reusable UI building blocks
- `features` for Redux slices and async workflows
- `services` for API communication
- `routes` for route guards and navigation logic
- `app` for store setup and typed hooks

Redux Toolkit is used for centralized state management across:

- `auth`
- `movies`
- `search`
- `favorites`
- `history`
- `admin`

### Backend Architecture

The backend is organized into:

- `routes` for API route declarations
- `controllers` for request handling
- `middlewares` for auth, validation, and error handling
- `models` for MongoDB schemas
- `validators` for Zod request validation
- `services` for TMDB integration
- `config` for database connection
- `utils` for shared helpers and error abstractions

This structure keeps the codebase modular, testable, and easier to extend.

## Routing

### Frontend Routes

- `/` - Home page
- `/about` - About page
- `/search` - Search page
- `/movies` - Movies listing page
- `/tv-shows` - TV shows listing page
- `/movie/:id` - Movie details
- `/tv/:id` - TV details
- `/person/:id` - Person details
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Protected user dashboard
- `/favorites` - Protected favorites page
- `/history` - Protected watch history page
- `/admin` - Admin-only dashboard

### Backend API Routes

- `/api/auth`
- `/api/discover`
- `/api/search`
- `/api/favorites`
- `/api/history`
- `/api/admin`

## Core Implementation Details

### Authentication and Authorization

- User passwords are hashed with `bcrypt`
- Authentication uses JWT tokens
- Tokens are stored in HTTP-only cookies for better security
- Protected backend routes use auth middleware
- Admin routes use role-based authorization middleware
- Banned users are blocked from logging in and from protected access

### State Management

Redux Toolkit powers async and shared state flows such as:

- authentication lifecycle
- home page discovery data
- search results and pagination
- favorites state
- history state
- admin data

This reduces prop drilling and keeps application state predictable and scalable.

### TMDB Integration

The backend includes a dedicated TMDB service layer that:

- fetches data from TMDB
- normalizes payloads
- builds image URLs
- exposes clean responses to the frontend

This prevents the frontend from being tightly coupled to raw third-party API responses.

### Favorites and History

- Favorites are stored in MongoDB per user
- Watch history is stored with `lastWatchedAt` and `watchCount`
- Compound indexes prevent duplicate user-item pairs
- Favorites logic was made concurrency-safe for repeated or parallel writes

### Search and Discovery

- Search is debounced on the frontend to reduce unnecessary API calls
- Infinite scrolling is implemented using `IntersectionObserver`
- Home page data is fetched in parallel for better initial performance

### Validation and Error Handling

- Request payloads are validated with Zod
- Centralized error middleware handles validation errors, duplicate key errors, JWT errors, and missing routes
- Axios response interception standardizes frontend error handling

## Performance and Scalability

The project was built with performance-focused choices such as:

- parallel API fetching with `Promise.all`
- debounced search input
- lazy image loading
- paginated and infinite-loaded sections
- normalized TMDB responses
- MongoDB indexes for favorites and history
- `lean()` queries on reads to reduce overhead
- centralized API client configuration
- concurrency-safe user data writes

## Load Testing Results

Load testing was performed on the deployed Render instance using `k6`.

Validated results:

- Public APIs remained stable under concurrent traffic
- Authenticated flows were tested with login, session validation, favorites, and history endpoints
- The platform remained stable at **350 concurrent authenticated virtual users**
- At **350 VUs**, the application recorded **0% request failures**
- Observed p95 latency at **350 VUs** was approximately **477ms**
- Initial degradation began around **400 concurrent users**
- Instability became noticeable at **500 concurrent users**

Conservative performance summary:

- Stable at **300+ concurrent authenticated users**
- Fully validated at **350 concurrent authenticated users**
- Degradation begins near **400 concurrent users** on the tested deployment

## Project Structure

```text
Movie Platform/
├── backend/
│   ├── public/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── load-tests/
│   ├── auth-flow.js
│   ├── public-load.js
│   └── README.md
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Gireejesh-Nilesh/movie-portal
cd "Movie Platform"
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside `backend/`.

Example variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=movie_platform
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
AUTH_COOKIE_NAME=token
TMDB_API_KEY=your_tmdb_api_key
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 5. Run the backend

```bash
cd backend
npm run dev
```

### 6. Run the frontend

```bash
cd frontend
npm run dev
```

## Build Commands

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm start
```

## Load Testing Commands

### Public flow

```bash
cd load-tests
k6 run ./public-load.js
```

### Authenticated flow

Set:

- `BASE_URL`
- `TEST_EMAIL`
- `TEST_PASSWORD`

Then run:

```bash
cd load-tests
k6 run ./auth-flow.js
```

The load-testing folder also contains reusable k6 scripts and instructions for summary export and report generation.

## Deployment

The application is deployed on Render.

Deployment notes:

- frontend and backend are deployed separately
- backend supports credentialed CORS
- backend trusts proxy settings for hosted environments
- Render free tier can introduce cold starts after idle periods

## What This Project Demonstrates

This project highlights practical full-stack engineering skills:

- frontend architecture and reusable UI composition
- backend API design
- secure authentication and authorization
- role-based access control
- state management with Redux Toolkit
- third-party API integration
- database modeling with MongoDB and Mongoose
- validation and centralized error handling
- performance optimization
- load testing and scalability analysis

## Future Improvements

- refresh token flow
- caching for high-traffic discovery endpoints
- automated tests
- CI/CD pipeline improvements
- image optimization and CDN strategy
- pagination and filtering improvements for admin data
- observability and metrics dashboard

## Author

Built by Gireejesh Nilesh as a full-stack movie discovery and user-management platform focused on architecture, performance, and scalability.
