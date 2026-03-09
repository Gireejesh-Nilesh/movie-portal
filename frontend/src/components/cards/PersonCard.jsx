import { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

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
  }, [item?.id, item?.profileUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
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
        <div className="h-full overflow-hidden bg-slate-900">
          {item.profileUrl && !imageFailed ? (
            <img
              src={item.profileUrl}
              alt={item.name}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
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
