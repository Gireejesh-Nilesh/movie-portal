import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CinematicNavbar from "../../components/common/CinematicNavbar";
import { clearAuthError } from "../../features/auth/authSlice";
import { signupThunk } from "../../features/auth/authThunks";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dispatch(signupThunk(form));
  };

  return (
    <main data-cursor-tone="dark" className="min-h-screen bg-black text-white">
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_18%,rgba(24,66,180,0.42),transparent_35%),radial-gradient(circle_at_92%_14%,rgba(14,34,110,0.55),transparent_40%),radial-gradient(circle_at_50%_118%,rgba(60,112,255,0.22),transparent_55%),linear-gradient(180deg,#030712_0%,#040a1c_48%,#020617_100%)] p-4 sm:p-5 md:p-6">
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(transparent_96%,rgba(255,255,255,0.08)_96%),linear-gradient(90deg,transparent_96%,rgba(255,255,255,0.08)_96%)] [background-size:22px_22px]" />
        <div className="relative">
          <CinematicNavbar />

          <div className="mx-auto mt-6 w-full max-w-2xl rounded-[32px] border border-white/15 bg-black/45 p-5 shadow-[0_35px_90px_-40px_rgba(60,112,255,0.75)] backdrop-blur-md sm:mt-8 md:p-8">
            <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Create Your Account</h1>
            <p className="mt-3 text-center text-sm text-slate-300">
              Join now to track favorites, watch history and personalized recommendations.
            </p>

            {error && (
              <p className="mt-4 rounded-lg border border-red-300/20 bg-red-500/15 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                    if (error) dispatch(clearAuthError());
                  }}
                  className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm outline-none transition focus:border-blue-300/70 focus:ring-2 focus:ring-blue-300/20"
                  required
                />
              </div>

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

              <div className="md:col-span-2">
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
                  minLength={6}
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl border border-blue-300/40 bg-gradient-to-r from-blue-500/85 via-cyan-400/75 to-blue-500/85 px-4 py-3 text-sm font-semibold text-black shadow-[0_0_30px_-14px_rgba(60,112,255,0.95)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </form>

            <Link to="/login" className="mt-5 inline-block text-sm text-cyan-200 hover:text-cyan-100">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
