import { useEffect, useMemo, useState } from "react";
import PageFrame from "../../components/common/PageFrame";
import CinematicLoader from "../../components/common/CinematicLoader";
import { adminApi } from "../../services/backend/adminApi";
import { useAppSelector } from "../../app/hooks";

const tabs = ["movies", "users", "stats"];

function posterUrlFor(movie) {
  return movie?.posterImageUrl || movie?.posterUrl || "";
}

function userBadge(user) {
  return user?.isBanned ? "Blocked" : user?.role === "admin" ? "Admin" : "Active";
}

export default function AdminPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movieForm, setMovieForm] = useState({
    title: "",
    posterImageUrl: "",
    description: "",
    movieId: "",
    releaseDate: "",
    trailerYouTubeLink: "",
    genre: "",
    category: "movie",
  });

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [moviesRes, usersRes, statsRes] = await Promise.all([
        adminApi.getMovies(),
        adminApi.getUsers(),
        adminApi.getStats(),
      ]);
      setMovies(moviesRes?.data?.movies || []);
      setUsers(usersRes?.data?.users || []);
      setStats(statsRes?.data?.stats || null);
    } catch (err) {
      setError(err.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (entry) =>
        String(entry?.name || "").toLowerCase().includes(query) ||
        String(entry?.email || "").toLowerCase().includes(query)
    );
  }, [userSearch, users]);

  const handleAddMovie = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await adminApi.addMovie({
        ...movieForm,
        genre: movieForm.genre
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setMovieForm({
        title: "",
        posterImageUrl: "",
        description: "",
        movieId: "",
        releaseDate: "",
        trailerYouTubeLink: "",
        genre: "",
        category: "movie",
      });
      await loadAdminData();
    } catch (err) {
      setError(err.message || "Failed to add movie");
    }
  };

  const handleDeleteMovie = async (id) => {
    setError("");
    try {
      await adminApi.deleteMovie(id);
      setMovies((prev) => prev.filter((movie) => movie._id !== id));
      setStats((prev) => (prev ? { ...prev, moviesCount: Math.max((prev.moviesCount || 1) - 1, 0) } : prev));
    } catch (err) {
      setError(err.message || "Failed to delete movie");
    }
  };

  const handleToggleBan = async (entry) => {
    setError("");
    try {
      const response = await adminApi.banUser(entry._id, !entry.isBanned);
      const updated = response?.data?.user;
      setUsers((prev) => prev.map((userEntry) => (userEntry._id === updated._id ? updated : userEntry)));
      await loadAdminData();
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  };

  return (
    <PageFrame tone="orange">
      <section className="mt-8 rounded-[28px] border border-white/12 bg-black/40 p-5 backdrop-blur-sm md:p-7">
        <p className="inline-flex rounded-full border border-amber-300/35 bg-amber-400/12 px-3 py-1 text-xs text-amber-100">
          Admin Access
        </p>
        <h1 className="mt-4 text-3xl font-black md:text-4xl">Dashboard Control Room</h1>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Logged in as {user?.name || "Admin"}. Manage catalog, users and platform stats from one place.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "rounded-full border px-4 py-2 text-sm capitalize transition",
                activeTab === tab
                  ? "border-amber-200/40 bg-amber-400/20 text-amber-100"
                  : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        {loading ? (
          <CinematicLoader label="Syncing control room" />
        ) : (
          <>
            {activeTab === "movies" && (
              <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
                <form
                  onSubmit={handleAddMovie}
                  className="rounded-2xl border border-white/12 bg-slate-900/65 p-4"
                >
                  <h2 className="text-lg font-semibold text-white">Add New Movie</h2>
                  <div className="mt-4 grid gap-3">
                    {[
                      ["title", "Movie title"],
                      ["posterImageUrl", "Poster image URL"],
                      ["movieId", "Movie ID"],
                      ["releaseDate", "Release date"],
                      ["trailerYouTubeLink", "Trailer YouTube link"],
                      ["genre", "Genres (comma separated)"],
                    ].map(([key, label]) => (
                      <input
                        key={key}
                        value={movieForm[key]}
                        onChange={(event) =>
                          setMovieForm((prev) => ({ ...prev, [key]: event.target.value }))
                        }
                        placeholder={label}
                        className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
                      />
                    ))}
                    <textarea
                      value={movieForm.description}
                      onChange={(event) =>
                        setMovieForm((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="Description"
                      rows={4}
                      className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
                    />
                    <select
                      value={movieForm.category}
                      onChange={(event) =>
                        setMovieForm((prev) => ({ ...prev, category: event.target.value }))
                      }
                      className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
                    >
                      <option value="movie">Movie</option>
                      <option value="tv">TV</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg border border-amber-300/40 bg-amber-400/20 px-4 py-2 text-sm text-amber-100 hover:bg-amber-400/30"
                    >
                      Add to Catalog
                    </button>
                  </div>
                </form>

                <div className="rounded-2xl border border-white/12 bg-slate-900/65 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-white">Admin Catalog</h2>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                      Delete from UI enabled
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {movies.map((movie) => (
                      <article
                        key={movie._id}
                        className="overflow-hidden rounded-2xl border border-white/12 bg-slate-950/75"
                      >
                        <div className="aspect-[2/3] bg-slate-900">
                          {posterUrlFor(movie) ? (
                            <img src={posterUrlFor(movie)} alt={movie.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full place-items-center text-xs text-slate-400">No poster</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</p>
                          <p className="mt-1 text-xs text-slate-400">{movie.category.toUpperCase()}</p>
                          <button
                            onClick={() => handleDeleteMovie(movie._id)}
                            className="mt-3 rounded-lg border border-red-300/30 bg-red-500/15 px-3 py-2 text-xs text-red-100 hover:bg-red-500/25"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="mt-6 rounded-2xl border border-white/12 bg-slate-900/65 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-lg font-semibold text-white">User Profiles</h2>
                  <input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Search users..."
                    className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none md:max-w-sm"
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredUsers.map((entry) => (
                    <article
                      key={entry._id}
                      className="rounded-2xl border border-white/12 bg-slate-950/75 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/5 text-sm font-bold text-white">
                          {String(entry.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100">
                          {userBadge(entry)}
                        </span>
                      </div>
                      <p className="mt-4 text-base font-semibold text-white">{entry.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{entry.email}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleToggleBan(entry)}
                          disabled={entry.role === "admin"}
                          className="rounded-lg border border-amber-300/30 bg-amber-400/12 px-3 py-2 text-xs text-amber-100 hover:bg-amber-400/22 disabled:opacity-40"
                        >
                          {entry.isBanned ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  ["Users", stats?.usersCount || 0],
                  ["Blocked Users", stats?.bannedUsersCount || 0],
                  ["Admin Movies", stats?.moviesCount || 0],
                  ["Favorites", stats?.favoritesCount || 0],
                  ["History Entries", stats?.historyCount || 0],
                ].map(([label, value]) => (
                  <article
                    key={label}
                    className="rounded-2xl border border-white/12 bg-slate-900/65 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
                    <p className="mt-3 text-3xl font-black text-white">{value}</p>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </PageFrame>
  );
}
