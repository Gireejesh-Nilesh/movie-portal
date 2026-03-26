import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: __ENV.STAGE_1_DURATION || "20s", target: Number(__ENV.STAGE_1_TARGET || 10) },
    { duration: __ENV.STAGE_2_DURATION || "40s", target: Number(__ENV.STAGE_2_TARGET || 20) },
    { duration: __ENV.STAGE_3_DURATION || "40s", target: Number(__ENV.STAGE_3_TARGET || 50) },
    { duration: __ENV.STAGE_4_DURATION || "30s", target: Number(__ENV.STAGE_4_TARGET || 0) },
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
