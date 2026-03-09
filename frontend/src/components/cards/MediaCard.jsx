import { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const getMediaRoute = (mediaType, id) => {
  if (mediaType === "tv") {
    return `/tv/${id}`;
  }
  return `/movie/${id}`;
};

export default function MediaCard({ item, onLongHover, onHoverEnd }) {
  if (!item || !item.id) {
    return null;
  }

  const hasPoster =
    Object.prototype.hasOwnProperty.call(item, "posterPath")
      ? Boolean(item.posterPath)
      : Boolean(item.posterUrl);

  if (!hasPoster) {
    return null;
  }

  const route = getMediaRoute(item.mediaType, item.id);
  const timerRef = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);

  const handleMouseEnter = () => {
    timerRef.current = window.setTimeout(() => {
      onLongHover?.(item);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onHoverEnd?.();
  };

  useEffect(() => {
    setImageFailed(false);
  }, [item?.id, item?.posterUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Link
      to={route}
      state={{ item }}
      className="block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article className="group relative h-[300px] w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white">
        <div className="h-full overflow-hidden bg-slate-900">
          {item.posterUrl && !imageFailed ? (
            <img
              src={item.posterUrl}
              alt={item.title}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-slate-900 text-center">
              <p className="px-3 text-xs text-slate-300">Poster not available</p>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-black/20 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="line-clamp-2 text-sm font-semibold">{item.title}</h3>
          <p className="mt-1 text-xs text-slate-300">{item.releaseDate || "Release TBD"}</p>
          <p className="mt-1 text-xs font-medium text-amber-200">
            Rating: {Number(item.rating || 0).toFixed(1)}
          </p>
        </div>
      </article>
    </Link>
  );
}
