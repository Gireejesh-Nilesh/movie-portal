import { useEffect, useMemo, useRef, useState } from "react";
import MediaCard from "../../components/cards/MediaCard";
import CinematicLoader from "../../components/common/CinematicLoader";
import PageFrame from "../../components/common/PageFrame";
import { discoverApi } from "../../services/backend/discoverApi";

const languageLabel = (code) => {
  const map = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
    ko: "Korean",
    ja: "Japanese",
    zh: "Chinese",
    fr: "French",
    es: "Spanish",
  };
  return map[code] || code?.toUpperCase() || "Unknown";
};

export default function MoviesPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const loadMoreRef = useRef(null);

  const languages = useMemo(() => {
    const set = new Set(items.map((item) => item.originalLanguage).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);
  const isInitialLoading = loading && items.length === 0;

  const visibleItems = useMemo(() => {
    let list = [...items];

    if (languageFilter !== "all") {
      list = list.filter((item) => item.originalLanguage === languageFilter);
    }
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.trim().toLowerCase();
      list = list.filter((item) =>
        String(item.title || "").toLowerCase().includes(query),
      );
    }

    return list;
  }, [items, languageFilter, debouncedSearchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 260);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadFirstPage = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await discoverApi.movies(1);
        const results = response?.data?.results || [];
        const totalPages = Number(response?.data?.totalPages || 1);
        setItems(results);
        setPage(1);
        setHasMore(1 < totalPages);
      } catch (err) {
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    loadFirstPage();
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return undefined;
    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || loading || !hasMore) return;

        const loadNext = async () => {
          setLoading(true);
          try {
            const nextPage = page + 1;
            const response = await discoverApi.movies(nextPage);
            const results = response?.data?.results || [];
            const totalPages = Number(response?.data?.totalPages || nextPage);
            setItems((prev) => {
              const merged = [...prev, ...results];
              return merged.filter(
                (item, index, self) =>
                  self.findIndex((candidate) => candidate.id === item.id) === index,
              );
            });
            setPage(nextPage);
            setHasMore(nextPage < totalPages);
          } catch (err) {
            setError(err.message || "Failed to load more movies");
            setHasMore(false);
          } finally {
            setLoading(false);
          }
        };

        loadNext();
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [hasMore, loading, page]);

  return (
    <PageFrame tone="blue">
      <section className="mt-8 rounded-[28px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm md:p-7">
        <h1 className="text-3xl font-black md:text-4xl">Movies</h1>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Discover popular and trending movies with infinite loading.
        </p>

        {!isInitialLoading && (
          <div className="mt-5 grid gap-3 rounded-xl border border-white/12 bg-slate-900/45 p-3 md:grid-cols-2">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="filter-select rounded-lg border border-cyan-300/20 bg-slate-900/45 px-3 py-2 text-sm text-cyan-50 outline-none backdrop-blur-md"
            >
              <option value="all">Language: All</option>
              {languages.map((code) => (
                <option key={code} value={code}>
                  {languageLabel(code)}
                </option>
              ))}
            </select>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                languageFilter === "all"
                  ? "Search movies"
                  : `Search ${languageLabel(languageFilter)} movies`
              }
              className="rounded-lg border border-cyan-300/20 bg-slate-900/45 px-3 py-2 text-sm text-cyan-50 outline-none backdrop-blur-md placeholder:text-slate-400"
            />
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        {isInitialLoading ? (
          <CinematicLoader label="Loading movies" />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {visibleItems.map((item) => (
              <MediaCard key={`movies-${item.id}`} item={item} />
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="py-8 text-center">
          {loading && items.length > 0 && <p className="text-sm text-slate-300">Loading more movies...</p>}
          {!hasMore && !loading && <p className="text-xs text-slate-400">No more movies</p>}
        </div>
      </section>
    </PageFrame>
  );
}
