import { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const loadedProfileCache = new Set();

export default function PersonCard({ item, onLongHover, onHoverEnd }) {
  if (!item || !item.id) {
    return null;
  }

  const hasProfile =
    Object.prototype.hasOwnProperty.call(item, "profilePath")
      ? Boolean(item.profilePath)
      : Boolean(item.profileUrl);

  if (!hasProfile) {
    return null;
  }

  const timerRef = useRef(null);
  const imageTimeoutRef = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(
    item?.profileUrl ? loadedProfileCache.has(item.profileUrl) : false,
  );

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
    setImageLoaded(item?.profileUrl ? loadedProfileCache.has(item.profileUrl) : false);

    if (imageTimeoutRef.current) {
      window.clearTimeout(imageTimeoutRef.current);
      imageTimeoutRef.current = null;
    }

    if (item?.profileUrl && !loadedProfileCache.has(item.profileUrl)) {
      imageTimeoutRef.current = window.setTimeout(() => {
        setImageFailed(true);
        setImageLoaded(false);
        imageTimeoutRef.current = null;
      }, 8000);
    }
  }, [item?.id, item?.profileUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Link
      to={`/person/${item.id}`}
      state={{ item }}
      className="block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article className="group relative h-[300px] w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white">
        <div className="relative h-full overflow-hidden bg-slate-900">
          {!imageFailed && !imageLoaded && (
            <div className="media-card-skeleton absolute inset-0 z-[1] overflow-hidden bg-slate-900" />
          )}
          {item.profileUrl && !imageFailed ? (
            <img
              src={item.profileUrl}
              alt={item.name}
              onLoad={() => {
                if (item.profileUrl) {
                  loadedProfileCache.add(item.profileUrl);
                }
                if (imageTimeoutRef.current) {
                  window.clearTimeout(imageTimeoutRef.current);
                  imageTimeoutRef.current = null;
                }
                setImageLoaded(true);
              }}
              onError={() => {
                if (imageTimeoutRef.current) {
                  window.clearTimeout(imageTimeoutRef.current);
                  imageTimeoutRef.current = null;
                }
                setImageFailed(true);
                setImageLoaded(false);
              }}
              className={[
                "h-full w-full object-cover transition duration-500 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-slate-900 text-center">
              <p className="px-3 text-xs text-slate-300">Profile image not available</p>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-black/20 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="line-clamp-2 text-sm font-semibold">{item.name}</h3>
          <p className="mt-1 text-xs text-slate-300">{item.knownForDepartment || "Artist"}</p>
        </div>
      </article>
    </Link>
  );
}
