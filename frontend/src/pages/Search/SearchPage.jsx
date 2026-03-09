import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import MediaCard from "../../components/cards/MediaCard";
import PersonCard from "../../components/cards/PersonCard";
import PageFrame from "../../components/common/PageFrame";
import {
  resetSearchState,
  setSearchQuery,
} from "../../features/search/searchSlice";
import { searchMultiThunk } from "../../features/search/searchThunks";

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { query, results, page, hasMore, loading, error } = useAppSelector(
    (state) => state.search
  );
  const [inputValue, setInputValue] = useState(query);
  const loadMoreRef = useRef(null);
  const visibleResults = results.filter((item) =>
    item.mediaType === "person" ? Boolean(item.profilePath) : Boolean(item.posterPath)
  );

  useEffect(() => {
    const debounced = setTimeout(() => {
      const q = inputValue.trim();
      dispatch(setSearchQuery(q));
      dispatch(resetSearchState());

      if (q) {
        dispatch(searchMultiThunk({ query: q, page: 1, append: false }));
      }
    }, 450);

    return () => clearTimeout(debounced);
  }, [dispatch, inputValue]);

  useEffect(() => {
    if (!query || !hasMore || loading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          dispatch(searchMultiThunk({ query, page: page + 1, append: true }));
        }
      },
      { threshold: 0.25 }
    );

    const node = loadMoreRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [dispatch, hasMore, loading, page, query]);

  return (
    <PageFrame tone="blue">
      <div className="mt-8 rounded-[28px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm md:p-7">
        <h1 className="text-3xl font-black md:text-4xl">Search</h1>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Find movies, TV shows and people with real-time debounced search and endless results.
        </p>

        <div className="mt-6">
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Search movies, TV shows, people..."
            className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300/70 focus:ring-2 focus:ring-blue-300/20"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        {!query && (
          <p className="mt-6 text-slate-400">Start typing to search content.</p>
        )}

        {query && visibleResults.length === 0 && !loading && (
          <p className="mt-6 text-slate-400">No results found.</p>
        )}

        {visibleResults.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {visibleResults.map((item) =>
              item.mediaType === "person" ? (
                <PersonCard key={`person-${item.id}-${item.name}`} item={item} />
              ) : (
                <MediaCard key={`${item.mediaType}-${item.id}-${item.title}`} item={item} />
              )
            )}
          </div>
        )}

        {loading && <p className="mt-6 text-sm text-slate-300">Loading more results...</p>}
        <div ref={loadMoreRef} className="h-8 w-full" />
      </div>
    </PageFrame>
  );
}
