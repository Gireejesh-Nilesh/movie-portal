# Load Testing Guide

This project includes `k6` scripts for public endpoints and authenticated user flows.

## 1. Install k6

Windows:

```powershell
winget install k6.k6
```

Check installation:

```powershell
k6 version
```

## 2. Pick the environment

For local backend:

```powershell
$env:BASE_URL="http://localhost:3000"
```

For Render deployment:

```powershell
$env:BASE_URL="https://your-service-name.onrender.com"
```

## 3. Run the public load test

This script tests:

- `GET /api/health`
- `GET /api/discover/trending`
- `GET /api/search`
- `GET /api/discover/movies/:id`
- `GET /api/discover/tv/:id`

Command:

```powershell
k6 run .\load-tests\public-load.js
```

Optional custom test data:

```powershell
$env:SEARCH_QUERY="avatar"
$env:MOVIE_ID="550"
$env:TV_ID="1399"
k6 run .\load-tests\public-load.js
```

## 4. Create one reusable test account

Use your app signup page or API once and keep one dedicated email/password for testing. Do not use signup inside repeated load runs, otherwise duplicate-user errors will distort the results.

Example env vars:

```powershell
$env:TEST_EMAIL="your-test-user@example.com"
$env:TEST_PASSWORD="your-password"
```

## 5. Run the authenticated flow test

This script logs in and tests:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/favorites`
- `GET /api/favorites`
- `POST /api/history`
- `GET /api/history`

Command:

```powershell
k6 run .\load-tests\auth-flow.js
```

## 6. Start with small loads

Recommended order:

1. Public smoke test with the default stages
2. Auth flow with the default stages
3. Increase stages only after the previous run is stable

If you want to push harder, edit the `stages` in:

- `load-tests/public-load.js`
- `load-tests/auth-flow.js`

## 7. What to look at in the results

Focus on:

- `http_req_failed`
- `http_req_duration`
- `p(95)` latency
- request counts
- 4xx and 5xx responses

## 8. Interpreting Render free-tier runs

Render free web services can sleep after inactivity. The first request after idle time may be much slower than normal. Because of that:

- run one warm-up request first
- ignore the first cold-start run when comparing performance
- use repeated runs to find a more realistic steady-state latency

## 9. Safe reporting

After testing, report results like this:

`Load tested at 10/20/50 virtual users with k6 on March 26, 2026; p95 latency and error rate measured against the deployed Render instance.`

Avoid claiming an exact concurrent-user capacity unless your test setup, infrastructure, and success thresholds are clearly documented.
