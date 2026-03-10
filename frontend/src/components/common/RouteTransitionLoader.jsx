import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import CinematicLoader from "./CinematicLoader";

export default function RouteTransitionLoader() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const previousPathRef = useRef(location.pathname);
  const hideTimerRef = useRef(null);
  const unmountTimerRef = useRef(null);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) {
      return undefined;
    }

    previousPathRef.current = location.pathname;
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    if (unmountTimerRef.current) {
      window.clearTimeout(unmountTimerRef.current);
    }

    setMounted(true);
    requestAnimationFrame(() => {
      setActive(true);
    });

    hideTimerRef.current = window.setTimeout(() => {
      setActive(false);
      unmountTimerRef.current = window.setTimeout(() => {
        setMounted(false);
      }, 220);
    }, 520);

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
      if (unmountTimerRef.current) {
        window.clearTimeout(unmountTimerRef.current);
      }
    };
  }, [location.pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={[
        "pointer-events-none fixed inset-0 z-[70] grid place-items-center bg-slate-950/40 backdrop-blur-sm transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <CinematicLoader label="Loading page" />
    </div>
  );
}
