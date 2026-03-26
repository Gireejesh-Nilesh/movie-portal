import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 5 },
    { duration: "40s", target: 10 },
    { duration: "30s", target: 20 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<2500"],
  },
};

const BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const SEARCH_QUERY = __ENV.SEARCH_QUERY || "batman";
const MOVIE_ID = __ENV.MOVIE_ID || "550";
const TV_ID = __ENV.TV_ID || "1399";

export function setup() {
  const warmup = http.get(`${BASE_URL}/api/health`);
  check(warmup, {
    "warmup health returns 200": (res) => res.status === 200,
  });
}

export default function () {
  const health = http.get(`${BASE_URL}/api/health`);
  check(health, {
    "health status 200": (res) => res.status === 200,
  });

  const trending = http.get(
    `${BASE_URL}/api/discover/trending?page=1&mediaType=all&timeWindow=week`
  );
  check(trending, {
    "trending status 200": (res) => res.status === 200,
  });

  const search = http.get(
    `${BASE_URL}/api/search?q=${encodeURIComponent(SEARCH_QUERY)}&page=1`
  );
  check(search, {
    "search status 200": (res) => res.status === 200,
  });

  const movieDetails = http.get(`${BASE_URL}/api/discover/movies/${MOVIE_ID}`);
  check(movieDetails, {
    "movie details status 200": (res) => res.status === 200,
  });

  const tvDetails = http.get(`${BASE_URL}/api/discover/tv/${TV_ID}`);
  check(tvDetails, {
    "tv details status 200": (res) => res.status === 200,
  });

  sleep(1);
}
