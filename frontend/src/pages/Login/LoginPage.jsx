import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CinematicNavbar from "../../components/common/CinematicNavbar";
import { clearAuthError } from "../../features/auth/authSlice";
import { loginThunk } from "../../features/auth/authThunks";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dispatch(loginThunk(form));
  };

  return (
    <main data-cursor-tone="dark" className="min-h-screen bg-black text-white">
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_120%,rgba(60,112,255,0.35),transparent_45%),linear-gradient(180deg,#07070c_0%,#03040a_55%,#05070f_100%)] p-5 md:p-6">
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(transparent_96%,rgba(255,255,255,0.08)_96%),linear-gradient(90deg,transparent_96%,rgba(255,255,255,0.08)_96%)] [background-size:22px_22px]" />
        <div className="relative">
          <CinematicNavbar />

          <div className="mx-auto mt-8 w-full max-w-xl rounded-[32px] border border-white/15 bg-black/45 p-6 shadow-[0_35px_90px_-40px_rgba(60,112,255,0.75)] backdrop-blur-md md:p-8">
            <h1 className="text-center text-4xl font-semibold tracking-tight">Welcome Back</h1>
            <p className="mt-3 text-center text-sm text-slate-300">
              Login to continue your watchlist, favorites and personalized feed.
            </p>

            {error && (
              <p className="mt-4 rounded-lg border border-red-300/20 bg-red-500/15 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    if (error) dispatch(clearAuthError());
                  }}
                  className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none transition focus:border-blue-300/70 focus:ring-2 focus:ring-blue-300/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, password: e.target.value }));
                    if (error) dispatch(clearAuthError());
                  }}
                  className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none transition focus:border-blue-300/70 focus:ring-2 focus:ring-blue-300/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-blue-300/40 bg-gradient-to-r from-blue-500/85 via-cyan-400/75 to-blue-500/85 px-4 py-3 text-sm font-semibold text-black shadow-[0_0_30px_-14px_rgba(60,112,255,0.95)] transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <Link to="/signup" className="mt-5 inline-block text-sm text-cyan-200 hover:text-cyan-100">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
