import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PageFrame from "../../components/common/PageFrame";
import {
  removeFavorite as removeFavoriteState,
  setFavorites,
  setFavoritesError,
  setFavoritesLoading,
} from "../../features/favorites/favoritesSlice";
import { favoritesApi } from "../../services/backend/favoritesApi";

const getPoster = (item) => {
  const raw = item?.posterUrl || item?.posterPath || "";
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/")) return `https://image.tmdb.org/t/p/w500${raw}`;
  return raw;
};

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.favorites);

  useEffect(() => {
    const loadFavorites = async () => {
      dispatch(setFavoritesLoading(true));
      dispatch(setFavoritesError(null));
      try {
        const response = await favoritesApi.getAll();
        const favorites = response?.data?.favorites || response?.data?.data || response?.data || [];
        dispatch(setFavorites(Array.isArray(favorites) ? favorites : []));
      } catch (err) {
        dispatch(setFavoritesError(err.message || "Failed to load favorites"));
      } finally {
        dispatch(setFavoritesLoading(false));
      }
    };

    loadFavorites();
  }, [dispatch]);

  const handleRemove = async (item) => {
    try {
      await favoritesApi.remove({ movieId: item.movieId || item.id, mediaType: item.mediaType });
      dispatch(removeFavoriteState({ movieId: item.movieId || item.id, mediaType: item.mediaType }));
    } catch (err) {
      dispatch(setFavoritesError(err.message || "Failed to remove favorite"));
    }
  };

  return (
    <PageFrame tone="blue">
      <section className="mt-8 rounded-[28px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm md:p-7">
        <h1 className="text-3xl font-black md:text-4xl">Favorites</h1>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Your personal saved list, synced from backend.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        {loading && <p className="mt-6 text-sm text-slate-300">Loading favorites...</p>}

        {!loading && items.length === 0 && (
          <p className="mt-6 text-sm text-slate-400">No favorites yet.</p>
        )}

        {items.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const id = item.movieId || item.id;
              const mediaType = item.mediaType || "movie";
              const detailRoute = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
              const poster = getPoster(item);
              return (
                <article
                  key={`${mediaType}-${id}`}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70"
                >
                  <Link to={detailRoute} className="block">
                    <div className="aspect-[16/9] bg-slate-900">
                      {poster ? (
                        <img
                          src={poster}
                          alt={item.title || "Favorite"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-sm text-slate-300">
                          Poster not available
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="line-clamp-1 text-base font-semibold">{item.title || "Untitled"}</p>
                    <p className="mt-1 text-xs text-slate-300">{item.releaseDate || "Release TBD"}</p>
                    <button
                      onClick={() => handleRemove(item)}
                      className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-xs font-medium text-red-100 hover:bg-red-500/25"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageFrame>
  );
}
