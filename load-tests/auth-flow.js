import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    authenticated_users: {
      executor: "ramping-vus",
      startVUs: Number(__ENV.START_VUS || 1),
      stages: [
        { duration: __ENV.STAGE_1_DURATION || "20s", target: Number(__ENV.STAGE_1_TARGET || 5) },
        { duration: __ENV.STAGE_2_DURATION || "40s", target: Number(__ENV.STAGE_2_TARGET || 10) },
        { duration: __ENV.STAGE_3_DURATION || "40s", target: Number(__ENV.STAGE_3_TARGET || 20) },
        { duration: __ENV.STAGE_4_DURATION || "30s", target: Number(__ENV.STAGE_4_TARGET || 0) },
      ],
      gracefulRampDown: "5s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<3000"],
  },
};

const BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const TEST_EMAIL = __ENV.TEST_EMAIL || "";
const TEST_PASSWORD = __ENV.TEST_PASSWORD || "";
const MOVIE_ID = __ENV.MOVIE_ID || "550";
const MOVIE_TITLE = __ENV.MOVIE_TITLE || "Fight Club";
const RELEASE_DATE = __ENV.RELEASE_DATE || "1999-10-15";
const POSTER_PATH = __ENV.POSTER_PATH || "/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg";
function failIfMissingCredentials() {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error(
      "Set TEST_EMAIL and TEST_PASSWORD before running auth-flow.js"
    );
  }
}

function login() {
  const payload = JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  const response = http.post(`${BASE_URL}/api/auth/login`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(response, {
    "login status 200": (res) => res.status === 200,
  });

  return response;
}

export function setup() {
  failIfMissingCredentials();
  login();
}

export default function () {
  failIfMissingCredentials();

  const loginResponse = login();

  check(loginResponse, {
    "login response valid": (res) => res.status === 200,
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const me = http.get(`${BASE_URL}/api/auth/me`, params);
  check(me, {
    "me status 200": (res) => res.status === 200,
  });

  const uniqueMovieId = `${MOVIE_ID}-${__VU}-${__ITER}`;
  const favoritePayload = JSON.stringify({
    movieId: uniqueMovieId,
    mediaType: "movie",
    title: `${MOVIE_TITLE} ${__VU}-${__ITER}`,
    posterPath: POSTER_PATH,
    releaseDate: RELEASE_DATE,
  });

  const favoriteAdd = http.post(`${BASE_URL}/api/favorites`, favoritePayload, params);
  check(favoriteAdd, {
    "favorite add accepted": (res) => res.status === 200 || res.status === 201,
  });

  const favorites = http.get(`${BASE_URL}/api/favorites`, params);
  check(favorites, {
    "favorites status 200": (res) => res.status === 200,
  });

  const historyUpsert = http.post(`${BASE_URL}/api/history`, favoritePayload, params);
  check(historyUpsert, {
    "history upsert status 200": (res) => res.status === 200,
  });

  const history = http.get(`${BASE_URL}/api/history?limit=20`, params);
  check(history, {
    "history status 200": (res) => res.status === 200,
  });

  sleep(1);
}
