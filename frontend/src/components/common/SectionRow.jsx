import { useEffect, useRef, useState } from "react";
import { discoverApi } from "../../services/backend/discoverApi";

function Chevron({ side = "left" }) {
  const isLeft = side === "left";
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      {isLeft ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

export default function SectionRow({
  title,
  items,
  renderItem,
  autoDirection = "left",
  pauseAutoScroll = false,
}) {
  const closeTimeoutRef = useRef(null);
  const safeItems = Array.isArray(items) ? items : [];
  const rowRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [manualPauseUntil, setManualPauseUntil] = useState(0);
  const [previewItem, setPreviewItem] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPreviewLocked, setIsPreviewLocked] = useState(false);
  const [previewTrailer, setPreviewTrailer] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    const firstCard = rowRef.current.firstElementChild;
    const gap = 12;
    const cardWidth = firstCard ? firstCard.clientWidth + gap : 188;
    const cardsToJump = 3;
    const amount = cardWidth * cardsToJump * (direction === "left" ? -1 : 1);
    setManualPauseUntil(Date.now() + 1100);
    rowRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;

    const speed = 0.55;
    const interval = window.setInterval(() => {
      if (isHovered || pauseAutoScroll || Date.now() < manualPauseUntil) return;
      if (!rowRef.current) return;

      const maxScroll = rowRef.current.scrollWidth - rowRef.current.clientWidth;
      if (maxScroll <= 0) return;

      if (autoDirection === "left") {
        if (rowRef.current.scrollLeft >= maxScroll - 1) {
          rowRef.current.scrollLeft = 0;
        } else {
          rowRef.current.scrollLeft += speed;
        }
      } else {
        if (rowRef.current.scrollLeft <= 1) {
          rowRef.current.scrollLeft = maxScroll;
        } else {
          rowRef.current.scrollLeft -= speed;
        }
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [autoDirection, isHovered, pauseAutoScroll, manualPauseUntil]);

  const getPreviewImage = (item) => {
    const raw = item?.posterUrl || item?.profileUrl || item?.posterPath || item?.profilePath || "";
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    if (raw.startsWith("/")) return `https://image.tmdb.org/t/p/w780${raw}`;
    return raw;
  };

  const handleLongHover = (item) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setPreviewItem(item);
    setIsPreviewLocked(true);
    setIsPreviewVisible(true);
  };

  const handleHoverEnd = () => {
    if (!isPreviewLocked) {
      setPreviewItem(null);
    }
  };

  const handleClosePreview = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsPreviewVisible(false);
    setIsPreviewLocked(false);
    closeTimeoutRef.current = window.setTimeout(() => {
      setPreviewItem(null);
      setPreviewTrailer(null);
      setPreviewLoading(false);
      closeTimeoutRef.current = null;
    }, 520);
  };

  useEffect(() => {
    let active = true;

    const loadPreviewTrailer = async () => {
      const mediaType = previewItem?.mediaType;
      if (!previewItem || (mediaType !== "movie" && mediaType !== "tv")) {
        setPreviewTrailer(null);
        setPreviewLoading(false);
        return;
      }

      setPreviewLoading(true);
      try {
        const response =
          mediaType === "tv"
            ? await discoverApi.tvTrailer(previewItem.id)
            : await discoverApi.trailer(previewItem.id);
        if (!active) return;
        setPreviewTrailer(response?.data?.trailer || null);
      } catch (error) {
        if (!active) return;
        setPreviewTrailer(null);
      } finally {
        if (active) {
          setPreviewLoading(false);
        }
      }
    };

    loadPreviewTrailer();

    return () => {
      active = false;
    };
  }, [previewItem]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!safeItems.length) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      <div
        className={[
          "overflow-hidden transition-all duration-500 ease-out",
          isPreviewVisible
            ? "mb-4 max-h-[520px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2",
        ].join(" ")}
      >
        {previewItem ? (
          <div className="rounded-3xl border border-white/15 bg-black/45">
            {(previewItem.mediaType === "movie" || previewItem.mediaType === "tv") ? (
              <div className="relative h-72 w-full overflow-hidden bg-slate-900 md:h-[420px]">
                {previewTrailer?.embedUrl ? (
                  <iframe
                    src={`${previewTrailer.embedUrl}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
                    title={previewItem.title || "Trailer Preview"}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                  />
                ) : getPreviewImage(previewItem) ? (
                  <img
                    src={getPreviewImage(previewItem)}
                    alt={previewItem.title || "Preview"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-slate-300">
                    Trailer not available
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">
                      {previewItem.mediaType === "tv" ? "TV Preview" : "Movie Preview"}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-white md:text-2xl">
                      {previewItem.title || "Untitled"}
                    </h3>
                    <p className="mt-1 text-xs text-cyan-100/85">
                      {previewLoading
                        ? "Loading trailer..."
                        : previewTrailer?.embedUrl
                          ? "Trailer is playing."
                          : "Trailer for this title is currently unavailable."}
                    </p>
                  </div>
                  <button
                    onClick={handleClosePreview}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-black/40 text-white transition hover:bg-black/65"
                    aria-label="Close preview"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 6l12 12" />
                      <path d="M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid items-center gap-5 md:grid-cols-[320px_1fr]">
                <div className="h-56 w-full bg-slate-900 md:h-64">
                  {getPreviewImage(previewItem) ? (
                    <img
                      src={getPreviewImage(previewItem)}
                      alt={previewItem.name || "Preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-slate-300">
                      Image not available
                    </div>
                  )}
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Person Preview</p>
                    <button
                      onClick={handleClosePreview}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/30 text-white transition hover:bg-black/55"
                      aria-label="Close preview"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 6l12 12" />
                        <path d="M18 6 6 18" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
                    {previewItem.name || "Untitled"}
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-300 md:text-base">
                    <p>Department: {previewItem.knownForDepartment || "Not available"}</p>
                    <p>Popularity: {Number(previewItem.popularity || 0).toFixed(1)}</p>
                    <p>TMDB ID: {previewItem.id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="relative">
        <button
          onClick={() => scrollRow("left")}
          className={[
            "absolute left-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65",
            isHovered ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          aria-label={`Scroll ${title} left`}
        >
          <Chevron side="left" />
        </button>
        <button
          onClick={() => scrollRow("right")}
          className={[
            "absolute right-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65",
            isHovered ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          aria-label={`Scroll ${title} right`}
        >
          <Chevron side="right" />
        </button>

        <div
          ref={rowRef}
          className="no-scrollbar flex gap-3 overflow-x-auto px-14 pb-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {safeItems.map((item, index) =>
            renderItem(item, {
              index,
              onLongHover: handleLongHover,
              onHoverEnd: handleHoverEnd,
            })
          )}
        </div>
      </div>
    </section>
  );
}
