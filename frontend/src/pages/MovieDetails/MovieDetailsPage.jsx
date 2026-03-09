import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import PageFrame from "../../components/common/PageFrame";
import { discoverApi } from "../../services/backend/discoverApi";
import { historyApi } from "../../services/backend/historyApi";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const stateItem = location.state?.item;
  const [item, setItem] = useState(stateItem || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trailerEmbedUrl, setTrailerEmbedUrl] = useState("");
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let active = true;

    const loadMovieDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await discoverApi.movieDetails(id);
        if (!active) return;
        setItem(response?.data?.movie || null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load movie details");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMovieDetails();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const historyPayload = {
      movieId: String(id),
      mediaType: "movie",
      title: item?.title || `Movie #${id}`,
      posterPath: item?.posterPath || item?.posterUrl || "",
      releaseDate: item?.releaseDate || "",
    };

    const timer = window.setTimeout(() => {
      historyApi.addOrUpdate(historyPayload).catch(() => {});
    }, 60);

    return () => {
      window.clearTimeout(timer);
    };
  }, [id, isAuthenticated, item]);

  const posterUrl = useMemo(() => {
    if (item?.posterUrl) return item.posterUrl;
    if (item?.posterPath?.startsWith("http")) return item.posterPath;
    if (item?.posterPath) return `https://image.tmdb.org/t/p/w780${item.posterPath}`;
    return null;
  }, [item]);

  const releaseYear = item?.releaseDate ? new Date(item.releaseDate).getFullYear() : "TBD";

  const handlePlayTrailer = async () => {
    setTrailerLoading(true);
    setShowTrailer(false);
    try {
      const response = await discoverApi.trailer(id);
      const embedUrl = response?.data?.trailer?.embedUrl || "";
      setTrailerEmbedUrl(embedUrl);
      setShowTrailer(true);
    } catch (err) {
      setTrailerEmbedUrl("");
      setShowTrailer(true);
    } finally {
      setTrailerLoading(false);
    }
  };

  return (
    <PageFrame tone="blue">
      <div className="mt-8 rounded-[30px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm md:p-7">
        <Link to="/" className="text-sm text-cyan-300 hover:text-cyan-200">
          Back to Home
        </Link>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        {loading && <p className="mt-4 text-sm text-slate-300">Loading details...</p>}

        <div className="mt-5 grid gap-6 md:grid-cols-[260px_1fr]">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900">
            {posterUrl ? (
              <img src={posterUrl} alt={item?.title || `Movie ${id}`} className="h-full w-full object-cover" />
            ) : (
              <div className="grid aspect-[2/3] place-items-center text-sm text-slate-300">
                Poster Not Available
              </div>
            )}
          </div>

          <div>
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
              Movie Details
            </p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">{item?.title || `Movie ${id}`}</h1>
            <p className="mt-3 text-sm text-slate-300 md:text-base">
              {item?.description || item?.overview || "Description not available."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Year: {releaseYear}</span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">ID: {id}</span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                History: {isAuthenticated ? "Auto saved" : "Login required"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/15 bg-slate-900/50 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Trailer</h2>
            <button
              onClick={handlePlayTrailer}
              disabled={trailerLoading}
              className="rounded-lg border border-cyan-300/40 bg-cyan-400/20 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/30 disabled:opacity-60"
            >
              {trailerLoading ? "Loading..." : "Play Trailer"}
            </button>
          </div>

          {showTrailer && (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black">
              {trailerEmbedUrl ? (
                <iframe
                  src={`${trailerEmbedUrl}?autoplay=1&controls=1&rel=0`}
                  title={`${item?.title || "Movie"} trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="aspect-video w-full"
                />
              ) : (
                <p className="p-4 text-sm text-slate-300">
                  Trailer for this movie is currently unavailable.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
