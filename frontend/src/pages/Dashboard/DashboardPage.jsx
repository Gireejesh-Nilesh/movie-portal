import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import PageFrame from "../../components/common/PageFrame";
import { favoritesApi } from "../../services/backend/favoritesApi";
import { historyApi } from "../../services/backend/historyApi";

const getPoster = (item) => {
  const raw = item?.posterUrl || item?.posterPath || "";
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/")) return `https://image.tmdb.org/t/p/w500${raw}`;
  return raw;
};

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activePanel, setActivePanel] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dashboardQuery, setDashboardQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const openFavorites = async () => {
    setActivePanel("favorites");
    setLoading(true);
    setError("");
    try {
      const response = await favoritesApi.getAll();
      const items = response?.data?.favorites || response?.data?.data || response?.data || [];
      setFavorites(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const openHistory = async () => {
    setActivePanel("history");
    setLoading(true);
    setError("");
    try {
      const response = await historyApi.getAll(40);
      const items = response?.data?.history || response?.data?.data || response?.data || [];
      setHistory(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setSearchLoading(true);
    setError("");
    try {
      const [favRes, historyRes] = await Promise.all([favoritesApi.getAll(), historyApi.getAll(40)]);
      const favItems = favRes?.data?.favorites || favRes?.data?.data || favRes?.data || [];
      const historyItems = historyRes?.data?.history || historyRes?.data?.data || historyRes?.data || [];
      setFavorites(Array.isArray(favItems) ? favItems : []);
      setHistory(Array.isArray(historyItems) ? historyItems : []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setSearchLoading(false);
    }
  };

  const dashboardResults = useMemo(() => {
    const query = dashboardQuery.trim().toLowerCase();
    if (!query) return [];

    const favMatches = favorites
      .filter((item) => String(item?.title || "").toLowerCase().includes(query))
      .map((item) => ({ ...item, source: "Favorites" }));
    const historyMatches = history
      .filter((item) => String(item?.title || "").toLowerCase().includes(query))
      .map((item) => ({ ...item, source: "History" }));

    const merged = [...favMatches, ...historyMatches];
    const seen = new Set();
    return merged.filter((item) => {
      const id = item.movieId || item.id;
      const mediaType = item.mediaType || "movie";
      const key = `${item.source}-${mediaType}-${id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [dashboardQuery, favorites, history]);

  return (
    <PageFrame tone="blue">
      <section className="mt-8 rounded-[28px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm md:p-7">
        <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
          User Dashboard
        </p>
        <h1 className="mt-4 text-3xl font-black md:text-4xl">Welcome, {user?.name || "User"}</h1>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Manage your movie journey from here.
        </p>

        <div className="mt-5 rounded-xl border border-white/12 bg-slate-900/45 p-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={dashboardQuery}
              onChange={async (event) => {
                const value = event.target.value;
                setDashboardQuery(value);
                if (value.trim() && favorites.length === 0 && history.length === 0 && !searchLoading) {
                  await loadDashboardData();
                }
              }}
              placeholder="Search in Favorites and Watch History..."
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
            />
            <button
              onClick={loadDashboardData}
              disabled={searchLoading}
              className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-60"
            >
              {searchLoading ? "Syncing..." : "Sync"}
            </button>
          </div>

          {dashboardQuery.trim() && (
            <div className="mt-3 rounded-lg border border-white/12 bg-slate-950/60 p-3">
              <h3 className="text-sm font-semibold text-white">Dashboard Search Results</h3>
              {dashboardResults.length === 0 ? (
                <p className="mt-2 text-xs text-slate-400">No matching item in favorites or history.</p>
              ) : (
                <div className="mt-3 grid gap-2">
                  {dashboardResults.map((item) => {
                    const id = item.movieId || item.id;
                    const mediaType = item.mediaType || "movie";
                    const linkTo = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
                    return (
                      <Link
                        key={`dashboard-search-${item.source}-${mediaType}-${id}`}
                        to={linkTo}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2"
                      >
                        <span className="truncate text-sm text-white">{item.title || "Untitled"}</span>
                        <span className="ml-3 rounded-md border border-cyan-300/30 bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-100">
                          {item.source}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={openFavorites}
            className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white hover:bg-slate-900/80"
          >
            Open Favorites
          </button>
          <button
            onClick={openHistory}
            className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white hover:bg-slate-900/80"
          >
            Open Watch History
          </button>
          <button
            onClick={() => setDashboardQuery("")}
            className="rounded-xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white hover:bg-slate-900/80"
          >
            Clear Dashboard Search
          </button>
        </div>

        {activePanel && (
          <div className="mt-6 rounded-2xl border border-white/12 bg-slate-900/55 p-4 md:p-5">
            <h2 className="text-xl font-semibold text-white">
              {activePanel === "favorites" ? "Your Favorites" : "Your Watch History"}
            </h2>

            {error && (
              <p className="mt-3 rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            )}

            {loading && <p className="mt-3 text-sm text-slate-300">Loading...</p>}

            {!loading && activePanel === "favorites" && favorites.length === 0 && (
              <p className="mt-3 text-sm text-slate-400">No favorites yet.</p>
            )}
            {!loading && activePanel === "history" && history.length === 0 && (
              <p className="mt-3 text-sm text-slate-400">No watch history yet.</p>
            )}

            {!loading && activePanel === "favorites" && favorites.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {favorites.map((item) => {
                  const poster = getPoster(item);
                  const id = item.movieId || item.id;
                  const mediaType = item.mediaType || "movie";
                  const linkTo = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
                  return (
                    <Link
                      key={`fav-${mediaType}-${id}`}
                      to={linkTo}
                      className="overflow-hidden rounded-xl border border-white/12 bg-slate-950/70"
                    >
                      <div className="aspect-[2/3] bg-slate-900">
                        {poster ? (
                          <img src={poster} alt={item.title || "Favorite"} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-xs text-slate-400">No image</div>
                        )}
                      </div>
                      <p className="line-clamp-1 px-2 py-2 text-xs text-slate-200">{item.title || "Untitled"}</p>
                    </Link>
                  );
                })}
              </div>
            )}

            {!loading && activePanel === "history" && history.length > 0 && (
              <div className="mt-4 space-y-3">
                {history.map((item) => {
                  const poster = getPoster(item);
                  const id = item.movieId || item.id;
                  const mediaType = item.mediaType || "movie";
                  const linkTo = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
                  return (
                    <Link
                      key={`his-${mediaType}-${id}`}
                      to={linkTo}
                      className="flex items-center gap-3 rounded-xl border border-white/12 bg-slate-950/70 p-2"
                    >
                      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                        {poster ? (
                          <img src={poster} alt={item.title || "History item"} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-[10px] text-slate-400">No image</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{item.title || "Untitled"}</p>
                        <p className="text-xs text-slate-400">{item.releaseDate || "Release TBD"}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </PageFrame>
  );
}
