import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const FALLBACK_POSTER =
  "https://via.placeholder.com/500x750?text=Poster+Unavailable";

function getEmbedUrl(youtubeUrl) {
  if (!youtubeUrl) {
    return null;
  }

  const url = new URL(youtubeUrl);
  const key = url.searchParams.get("v");
  if (!key) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${key}&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1`;
}

export default function TrendingRotatorCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTrending = async () => {
      try {
        const trendingRes = await fetch(
          `${API_BASE_URL}/api/discover/trending?page=1&mediaType=movie&timeWindow=week`
        );
        const trendingData = await trendingRes.json();
        const topFive = (trendingData?.results || []).slice(0, 5);

        const withTrailers = await Promise.all(
          topFive.map(async (item, idx) => {
            const trailerRes = await fetch(
              `${API_BASE_URL}/api/discover/movies/${item.id}/trailer`
            );
            const trailerData = await trailerRes.json();
            const youtubeUrl = trailerData?.trailer?.youtubeUrl || null;

            return {
              id: item.id,
              rank: idx + 1,
              title: item.title || `Trending #${idx + 1}`,
              posterUrl: item.posterUrl || FALLBACK_POSTER,
              trailerEmbedUrl: getEmbedUrl(youtubeUrl),
            };
          })
        );

        if (mounted) {
          setItems(withTrailers);
        }
      } catch (error) {
        if (mounted) {
          setItems([
            {
              id: "fallback-1",
              rank: 1,
              title: "Trending Content",
              posterUrl: FALLBACK_POSTER,
              trailerEmbedUrl: null,
            },
          ]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTrending();
    return () => {
      mounted = false;
    };
  }, []);

  const activeItem = useMemo(() => items[activeIndex], [items, activeIndex]);

  const handleRotateComplete = () => {
    if (items.length < 2) {
      return;
    }
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  if (loading || !activeItem) {
    return (
      <article className="relative w-[min(88vw,500px)]">
        <div className="aspect-[1.58] animate-pulse rounded-[26px] border border-blue-100/20 bg-blue-950/60" />
      </article>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes trend-card-spin {
            0%, 40% { transform: rotateZ(28deg) rotateX(10deg) rotateY(0deg); }
            100% { transform: rotateZ(28deg) rotateX(10deg) rotateY(360deg); }
          }
        `}
      </style>

      <article className="group relative w-[min(88vw,500px)] [perspective:1800px]">
        <div
          onAnimationIteration={handleRotateComplete}
          style={{
            animation: "trend-card-spin 7.5s linear infinite",
            transformStyle: "preserve-3d",
            transformOrigin: "center",
            willChange: "transform",
          }}
          className="relative aspect-[1.58] rounded-[26px]"
        >
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 overflow-hidden rounded-[26px] border border-blue-100/20 bg-black shadow-[0_50px_110px_-38px_rgba(30,95,255,0.95)]"
          >
            {activeItem.trailerEmbedUrl ? (
              <>
                <iframe
                  src={activeItem.trailerEmbedUrl}
                  title={activeItem.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="h-full w-full"
                  loading="eager"
                />
                <div className="absolute inset-0 z-[1] bg-transparent" />
              </>
            ) : (
              <img
                src={activeItem.posterUrl}
                alt={activeItem.title}
                className="h-full w-full object-cover"
              />
            )}

            <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-14 bg-black/80" />
            <div className="absolute left-4 top-4 z-[3] rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs tracking-widest text-white/90">
              #{activeItem.rank} TRENDING
            </div>
            <div className="absolute inset-x-0 bottom-0 z-[3] translate-y-24 px-5 pb-5 transition-all duration-500 ease-out group-hover:translate-y-0">
              <h3 className="text-lg font-bold text-white md:text-xl">{activeItem.title}</h3>
              <button className="mt-3 rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300">
                Watch Now
              </button>
            </div>
          </div>

          <div
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
            className="absolute inset-0 overflow-hidden rounded-[26px] border border-blue-100/20 bg-black shadow-[0_50px_110px_-38px_rgba(30,95,255,0.95)]"
          >
            <img
              src={activeItem.posterUrl}
              alt={`${activeItem.title} poster`}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          </div>
        </div>
      </article>
    </>
  );
}
