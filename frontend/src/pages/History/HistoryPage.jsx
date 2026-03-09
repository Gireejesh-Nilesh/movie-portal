import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PageFrame from "../../components/common/PageFrame";
import {
  setHistory,
  setHistoryError,
  setHistoryLoading,
} from "../../features/history/historySlice";
import { historyApi } from "../../services/backend/historyApi";

const getPoster = (item) => {
  const raw = item?.posterUrl || item?.posterPath || "";
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/")) return `https://image.tmdb.org/t/p/w500${raw}`;
  return raw;
};

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.history);

  const loadHistory = useCallback(async () => {
    dispatch(setHistoryLoading(true));
    dispatch(setHistoryError(null));
    try {
      const response = await historyApi.getAll(40);
      const history = response?.data?.history || response?.data?.data || response?.data || [];
      dispatch(setHistory(Array.isArray(history) ? history : []));
    } catch (err) {
      dispatch(setHistoryError(err.message || "Failed to load history"));
    } finally {
      dispatch(setHistoryLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDeleteOne = async (item) => {
    try {
      await historyApi.remove({ movieId: item.movieId || item.id, mediaType: item.mediaType });
      loadHistory();
    } catch (err) {
      dispatch(setHistoryError(err.message || "Failed to remove history item"));
    }
  };

  const handleClearAll = async () => {
    try {
      await historyApi.clear();
      dispatch(setHistory([]));
    } catch (err) {
      dispatch(setHistoryError(err.message || "Failed to clear history"));
    }
  };

  return (
    <PageFrame tone="blue">
      <section className="mt-8 rounded-[28px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">Watch History</h1>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Recently opened movies and trailers from your account.
            </p>
          </div>
          <button
            onClick={handleClearAll}
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Clear All
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        {loading && <p className="mt-6 text-sm text-slate-300">Loading history...</p>}

        {!loading && items.length === 0 && (
          <p className="mt-6 text-sm text-slate-400">No watch history yet.</p>
        )}

        {items.length > 0 && (
          <div className="mt-8 space-y-3">
            {items.map((item) => {
              const id = item.movieId || item.id;
              const mediaType = item.mediaType || "movie";
              const detailRoute = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
              const poster = getPoster(item);
              return (
                <article
                  key={`${mediaType}-${id}`}
                  className="flex items-center gap-4 rounded-2xl border border-white/12 bg-slate-900/60 p-3"
                >
                  <Link to={detailRoute} className="block h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                    {poster ? (
                      <img src={poster} alt={item.title || "History item"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-slate-300">No Poster</div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{item.title || "Untitled"}</p>
                    <p className="mt-1 text-xs text-slate-300">{item.releaseDate || "Release TBD"}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOne(item)}
                    className="rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-xs text-red-100 hover:bg-red-500/25"
                  >
                    Delete
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageFrame>
  );
}
