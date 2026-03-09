import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutThunk } from "../../features/auth/authThunks";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Search", to: "/search" },
  { label: "Movies", to: "/movies" },
  { label: "TV Shows", to: "/tv-shows" },
];

function ArrowIcon({ direction = "right" }) {
  const isLeft = direction === "left";
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      {isLeft ? (
        <>
          <path d="M19 12H5" />
          <path d="m11 5-7 7 7 7" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}

export default function CinematicNavbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const profileLabel = user?.name?.charAt(0)?.toUpperCase() || "G";

  const handleAuthArrowClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await dispatch(logoutThunk());
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }
    navigate("/login");
  };

  return (
    <header className="relative rounded-3xl border border-white/15 bg-black/45 px-3 py-3 backdrop-blur-md shadow-[0_12px_50px_-25px_rgba(255,80,20,0.7)]">
      <div className="grid grid-cols-2 items-center gap-3 lg:grid-cols-3">
        <nav className="hidden flex-wrap gap-2 lg:col-span-1 lg:flex">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-full border px-4 py-2 text-sm transition",
                    isActive
                      ? "border-amber-200/40 bg-gradient-to-right from-amber-400/40 via-orange-400/25 to-transparent text-amber-100 shadow-[0_0_25px_-10px_rgba(255,180,60,0.9)]"
                      : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="text-center">
          <p className="text-4xl font-black uppercase tracking-[0.16em] text-red-300/85">CinePulse</p>
        </div>

        <div className="col-span-1 flex items-center justify-end gap-2 lg:col-span-1">
          <button
            onClick={handleAuthArrowClick}
            disabled={loading}
            className="hidden h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 disabled:opacity-60 lg:grid"
            title={isAuthenticated ? "Logout" : "Login"}
          >
            <ArrowIcon direction={isAuthenticated ? "right" : "left"} />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
            onClick={handleProfileClick}
            aria-label="Open dashboard"
          >
            <span className="text-sm font-bold">{profileLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
