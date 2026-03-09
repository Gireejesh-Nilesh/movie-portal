import { useEffect, useMemo, useRef, useState } from "react";
import MediaCard from "../../components/cards/MediaCard";
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

const getIndustry = (lang) => {
  const code = String(lang || "").toLowerCase();
  if (code === "hi") return "Bollywood";
  if (["ta", "te", "ml", "kn"].includes(code)) return "Indian Regional";
  if (code === "en") return "Hollywood";
  if (code === "ko") return "K-Industry";
  if (code === "ja") return "Japanese";
  if (code === "zh") return "Chinese";
  return "Global";
};

export default function MoviesPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("popularity_desc");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const loadMoreRef = useRef(null);

  const languages = useMemo(() => {
    const set = new Set(items.map((item) => item.originalLanguage).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const industries = useMemo(() => {
    const set = new Set(items.map((item) => getIndustry(item.originalLanguage)));
    return Array.from(set).sort();
  }, [items]);

  const visibleItems = useMemo(() => {
    let list = [...items];

    if (languageFilter !== "all") {
      list = list.filter((item) => item.originalLanguage === languageFilter);
    }
    if (industryFilter !== "all") {
      list = list.filter((item) => getIndustry(item.originalLanguage) === industryFilter);
    }

    list.sort((a, b) => {
      if (sortBy === "rating_desc") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "rating_asc") return (a.rating || 0) - (b.rating || 0);
      if (sortBy === "release_desc") return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
      if (sortBy === "release_asc") return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
      if (sortBy === "title_asc") return String(a.title || "").localeCompare(String(b.title || ""));
      if (sortBy === "title_desc") return String(b.title || "").localeCompare(String(a.title || ""));
      return (b.popularity || 0) - (a.popularity || 0);
    });

    return list;
  }, [items, languageFilter, industryFilter, sortBy]);

  useEffect(() => {
    let active = true;
    const loadFirstPage = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await discoverApi.movies(1);
        if (!active) return;
        const results = response?.data?.results || [];
        const totalPages = Number(response?.data?.totalPages || 1);
        setItems(results);
        setPage(1);
        setHasMore(1 < totalPages);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load movies");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadFirstPage();
    return () => {
      active = false;
    };
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
            setItems((prev) => [...prev, ...results]);
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

        <div className="mt-5 grid gap-3 rounded-xl border border-white/12 bg-slate-900/45 p-3 md:grid-cols-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="popularity_desc">Sort: Popularity (High to Low)</option>
            <option value="rating_desc">Sort: Rating (High to Low)</option>
            <option value="rating_asc">Sort: Rating (Low to High)</option>
            <option value="release_desc">Sort: Release Date (Newest)</option>
            <option value="release_asc">Sort: Release Date (Oldest)</option>
            <option value="title_asc">Sort: Title (A-Z)</option>
            <option value="title_desc">Sort: Title (Z-A)</option>
          </select>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="all">Language: All</option>
            {languages.map((code) => (
              <option key={code} value={code}>
                {languageLabel(code)}
              </option>
            ))}
          </select>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="all">Industry: All</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {visibleItems.map((item) => (
            <MediaCard key={`movies-${item.id}`} item={item} />
          ))}
        </div>

        <div ref={loadMoreRef} className="py-8 text-center">
          {loading && <p className="text-sm text-slate-300">Loading more movies...</p>}
          {!hasMore && !loading && <p className="text-xs text-slate-400">No more movies</p>}
        </div>
      </section>
    </PageFrame>
  );
}
