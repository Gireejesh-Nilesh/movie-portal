import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import MediaCard from "../../components/cards/MediaCard";
import PersonCard from "../../components/cards/PersonCard";
import CinematicNavbar from "../../components/common/CinematicNavbar";
import CinematicLoader from "../../components/common/CinematicLoader";
import SectionRow from "../../components/common/SectionRow";
import { fetchHomeDataThunk } from "../../features/movies/moviesThunks";
import { discoverApi } from "../../services/backend/discoverApi";

function HoverWord({ label, onEnter, onLeave }) {
  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative cursor-pointer text-cyan-100 transition hover:text-white"
    >
      {label}
    </span>
  );
}

function HoverPosterCloud({ visible, items }) {
  const cardPositions = [
    "left-[-160px] top-[-62px] rotate-[-8deg]",
    "left-[4%] top-[-128px] rotate-[-4deg]",
    "right-[8%] top-[-132px] rotate-[4deg]",
    "right-[-148px] top-[-52px] rotate-[9deg]",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {items.slice(0, 4).map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className={[
            "absolute h-40 w-28 overflow-hidden rounded-xl border border-white/20 bg-slate-900 shadow-[0_22px_45px_-20px_rgba(0,0,0,0.88)] transition-all duration-300",
            cardPositions[index] || cardPositions[0],
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-95",
          ].join(" ")}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

const MOVIE_TITLE_PARTS = {
  a: [
    "Cinematic",
    "Spotlight",
    "Premiere",
    "Silver Screen",
    "Blockbuster",
    "Must-Watch",
    "Weekend",
    "Critics'",
    "Audience",
    "Fresh",
    "Top-Rated",
    "Epic",
    "Prime",
  ],
  b: [
    "Movie Vault",
    "Film Collection",
    "Movie Picks",
    "Film Highlights",
    "Movie Parade",
    "Film Showcase",
    "Screen Favorites",
    "Film Waves",
    "Movie Gems",
    "Cinema Queue",
    "Film Edition",
    "Movie Circuit",
  ],
};

const TV_TITLE_PARTS = {
  a: [
    "Binge",
    "Prime-Time",
    "Series",
    "Must-Stream",
    "Top",
    "Weekly",
    "Trending",
    "Late-Night",
    "Viewer's",
    "Premium",
    "Spotlight",
    "Fan",
    "Streamline",
  ],
  b: [
    "Showcase",
    "Series Hub",
    "TV Wave",
    "Episode Stack",
    "Series Shelf",
    "Show Basket",
    "TV Lineup",
    "Show Reels",
    "Series Picks",
    "Watchlist Stream",
    "TV Spotlight",
    "Series Track",
  ],
};

const PEOPLE_TITLE_PARTS = {
  a: [
    "Popular",
    "Star",
    "Featured",
    "Iconic",
    "Screen",
    "Celebrity",
    "Rising",
    "Spotlight",
    "Audience",
    "Fan-Favorite",
    "Creative",
    "On-Screen",
    "Global",
  ],
  b: [
    "Personalities",
    "Faces",
    "Talents",
    "Artists",
    "Profiles",
    "Performers",
    "Names",
    "Stars",
    "Legends",
    "Voices",
    "Icons",
    "Crew Highlights",
  ],
};

function getUniqueSectionTitle(kind, page) {
  const index = Math.max(page - 2, 0);
  const sets =
    kind === "person"
      ? PEOPLE_TITLE_PARTS
      : kind === "tv"
        ? TV_TITLE_PARTS
        : MOVIE_TITLE_PARTS;
  const first = sets.a[index % sets.a.length];
  const second = sets.b[(index * 5 + 3) % sets.b.length];
  return `${first} ${second}`;
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const heroSectionRef = useRef(null);
  const [activeHover, setActiveHover] = useState(null);
  const [extraSections, setExtraSections] = useState([]);
  const [nextPage, setNextPage] = useState(2);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreSections, setHasMoreSections] = useState(true);
  const [maxPage, setMaxPage] = useState(null);
  const loadMoreRef = useRef(null);
  const [showBackToHero, setShowBackToHero] = useState(false);
  const { trending, popularMovies, popularTV, people, loading, error } =
    useAppSelector((state) => state.movies);
  const isInitialLoading =
    loading &&
    trending.length === 0 &&
    popularMovies.length === 0 &&
    popularTV.length === 0 &&
    people.length === 0;

  useEffect(() => {
    dispatch(fetchHomeDataThunk());
  }, [dispatch]);

  const movieHoverItems = useMemo(
    () =>
      popularMovies
        .filter((item) => item?.posterUrl)
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          title: item.title || "Movie",
          imageUrl: item.posterUrl,
        })),
    [popularMovies],
  );

  const tvHoverItems = useMemo(
    () =>
      popularTV
        .filter((item) => item?.posterUrl)
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          title: item.title || "TV Show",
          imageUrl: item.posterUrl,
        })),
    [popularTV],
  );

  const peopleHoverItems = useMemo(
    () =>
      people
        .filter((item) => item?.profileUrl)
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          title: item.name || "Person",
          imageUrl: item.profileUrl,
        })),
    [people],
  );

  useEffect(() => {
    if (!hasMoreSections || isLoadingMore) {
      return undefined;
    }

    const node = loadMoreRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || isLoadingMore || !hasMoreSections) {
          return;
        }

        const loadMore = async () => {
          setIsLoadingMore(true);
          try {
            const [moviesRes, tvRes, peopleRes] = await Promise.all([
              discoverApi.movies(nextPage),
              discoverApi.tv(nextPage),
              discoverApi.people(nextPage),
            ]);

            const moviesItems = moviesRes?.data?.results || [];
            const tvItems = tvRes?.data?.results || [];
            const peopleItems = peopleRes?.data?.results || [];

            const computedMaxPage = Math.min(
              Number(moviesRes?.data?.totalPages || nextPage),
              Number(tvRes?.data?.totalPages || nextPage),
              Number(peopleRes?.data?.totalPages || nextPage),
            );

            setMaxPage((prev) =>
              prev ? Math.min(prev, computedMaxPage) : computedMaxPage,
            );

            const newSections = [
              {
                id: `movies-page-${nextPage}`,
                title: getUniqueSectionTitle("movie", nextPage),
                items: moviesItems,
                kind: "media",
                direction: nextPage % 2 === 0 ? "right" : "left",
              },
              {
                id: `tv-page-${nextPage}`,
                title: getUniqueSectionTitle("tv", nextPage),
                items: tvItems,
                kind: "media",
                direction: nextPage % 2 === 0 ? "left" : "right",
              },
              {
                id: `people-page-${nextPage}`,
                title: getUniqueSectionTitle("person", nextPage),
                items: peopleItems,
                kind: "person",
                direction: nextPage % 2 === 0 ? "right" : "left",
              },
            ].filter((section) => section.items.length > 0);

            if (newSections.length > 0) {
              setExtraSections((prev) => [...prev, ...newSections]);
            }

            const reachedEnd =
              nextPage >= computedMaxPage || newSections.length === 0;
            setHasMoreSections(!reachedEnd);
            setNextPage((prev) => prev + 1);
          } catch (err) {
            setHasMoreSections(false);
          } finally {
            setIsLoadingMore(false);
          }
        };

        loadMore();
      },
      { threshold: 0.25 },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [hasMoreSections, isLoadingMore, nextPage]);

  useEffect(() => {
    const onScroll = () => {
      const triggerHeight =
        heroSectionRef.current?.offsetHeight || window.innerHeight;
      setShowBackToHero(window.scrollY > Math.max(140, triggerHeight * 0.35));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleBackToHero = () => {
    heroSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-black">
      <section
        ref={heroSectionRef}
        data-cursor-tone="blue"
        className="w-full overflow-hidden bg-black text-white"
      >
        <div className="relative min-h-screen bg-[radial-gradient(circle_at_15%_18%,rgba(24,66,180,0.42),transparent_35%),radial-gradient(circle_at_92%_14%,rgba(14,34,110,0.55),transparent_40%),radial-gradient(circle_at_50%_118%,rgba(60,112,255,0.22),transparent_55%),linear-gradient(180deg,#030712_0%,#040a1c_48%,#020617_100%)] p-4 sm:p-5 md:p-6">
          <div className="absolute inset-0 opacity-25 [background:linear-gradient(transparent_96%,rgba(255,255,255,0.08)_96%),linear-gradient(90deg,transparent_96%,rgba(255,255,255,0.08)_96%)] [background-size:20px_20px]" />

          <div className="relative">
            <CinematicNavbar />
            <div className="grid min-h-[calc(100vh-110px)] place-items-center pt-6 text-center">
              <div className="max-w-2xl">
                <p className="inline-flex rounded-full border border-blue-200/30 bg-blue-900/30 px-4 py-1 text-sm text-blue-100">
                  Movie Discovery Platform
                </p>
                <h1 className="relative mt-5 text-3xl font-black leading-tight text-white sm:text-4xl md:text-6xl">
                  <HoverPosterCloud
                    visible={activeHover === "movies"}
                    items={movieHoverItems}
                  />
                  <HoverPosterCloud
                    visible={activeHover === "tv"}
                    items={tvHoverItems}
                  />
                  <HoverPosterCloud
                    visible={activeHover === "people"}
                    items={peopleHoverItems}
                  />
                  Discover{" "}
                  <HoverWord
                    label="Movies"
                    onEnter={() => setActiveHover("movies")}
                    onLeave={() => setActiveHover(null)}
                  />
                  ,
                  <br />
                  <HoverWord
                    label="TV Shows"
                    onEnter={() => setActiveHover("tv")}
                    onLeave={() => setActiveHover(null)}
                  />{" "}
                  and{" "}
                  <HoverWord
                    label="People"
                    onEnter={() => setActiveHover("people")}
                    onLeave={() => setActiveHover(null)}
                  />
                </h1>
                <p className="mt-4 text-sm text-blue-100/85 md:text-base">
                  Explore trending titles, search in real time, watch trailers,
                  and manage your favorites and watch history in one place.
                </p>
              </div>
            </div>

            {isInitialLoading && <CinematicLoader label="Loading home sections" />}
            {error && (
              <p className="mt-8 rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            {!isInitialLoading && (
              <>
                <SectionRow
                  title="Trending"
                  items={trending}
                  autoDirection="left"
                  renderItem={(item, handlers) => (
                    <MediaCard
                      key={`trending-${item.id}`}
                      item={item}
                      onLongHover={handlers.onLongHover}
                      onHoverEnd={handlers.onHoverEnd}
                    />
                  )}
                />
                <SectionRow
                  title="Popular Movies"
                  items={popularMovies}
                  autoDirection="right"
                  renderItem={(item, handlers) => (
                    <MediaCard
                      key={`pm-${item.id}`}
                      item={item}
                      onLongHover={handlers.onLongHover}
                      onHoverEnd={handlers.onHoverEnd}
                    />
                  )}
                />
                <SectionRow
                  title="Popular TV"
                  items={popularTV}
                  autoDirection="left"
                  renderItem={(item, handlers) => (
                    <MediaCard
                      key={`pt-${item.id}`}
                      item={item}
                      onLongHover={handlers.onLongHover}
                      onHoverEnd={handlers.onHoverEnd}
                    />
                  )}
                />
                <SectionRow
                  title="Popular People"
                  items={people}
                  autoDirection="right"
                  renderItem={(item, handlers) => (
                    <PersonCard
                      key={`pp-${item.id}`}
                      item={item}
                      onLongHover={handlers.onLongHover}
                      onHoverEnd={handlers.onHoverEnd}
                    />
                  )}
                />

                {extraSections.map((section) => (
                  <SectionRow
                    key={section.id}
                    title={section.title}
                    items={section.items}
                    autoDirection={section.direction}
                    renderItem={(item, handlers) =>
                      section.kind === "person" ? (
                        <PersonCard
                          key={`extra-person-${section.id}-${item.id}`}
                          item={item}
                          onLongHover={handlers.onLongHover}
                          onHoverEnd={handlers.onHoverEnd}
                        />
                      ) : (
                        <MediaCard
                          key={`extra-media-${section.id}-${item.id}`}
                          item={item}
                          onLongHover={handlers.onLongHover}
                          onHoverEnd={handlers.onHoverEnd}
                        />
                      )
                    }
                  />
                ))}
              </>
            )}

            <div ref={loadMoreRef} className="py-10 text-center">
              {isLoadingMore && (
                <CinematicLoader label="Loading more sections" />
              )}
              {!hasMoreSections && (
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {maxPage
                    ? `You have reached page ${maxPage}`
                    : "No more sections"}
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      {showBackToHero && (
        <button
          onClick={handleBackToHero}
          aria-label="Back to hero section"
          className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-cyan-200/40 bg-cyan-500/30 text-white shadow-[0_14px_35px_-15px_rgba(56,189,248,0.95)] backdrop-blur-sm transition hover:bg-cyan-500/50"
          style={{ animation: "heroArrowFloat 1s ease-in-out infinite" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      )}

      <style>
        {`
          @keyframes heroArrowFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-7px); }
          }
        `}
      </style>
    </main>
  );
}
