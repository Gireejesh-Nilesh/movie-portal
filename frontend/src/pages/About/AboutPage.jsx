import PageFrame from "../../components/common/PageFrame";

const platformStats = [
  { label: "Dynamic Sections", value: "6+" },
  { label: "Search Types", value: "3" },
  { label: "Protected Modules", value: "4" },
  { label: "Admin Controls", value: "5" },
];

export default function AboutPage() {
  return (
    <PageFrame tone="blue">
      <section className="mt-8 rounded-[32px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm sm:p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-100">
              About Us
            </p>
            <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl md:text-5xl">
              CinePulse is built to make movie discovery feel structured, fast and usable.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              CinePulse is a full-stack movie discovery platform powered by TMDB for live content
              and a custom backend for user-focused features. The goal is simple: give users one
              place to discover movies, TV shows and people, search in real time, watch trailers,
              track favorites, manage history and support admin workflows.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/12 bg-slate-950/60 p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">
                  Project Focus
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Real-time search, smooth browsing, trailer previews, JWT-based authentication,
                  favorites, watch history, admin controls and responsive front-end behavior.
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-slate-950/60 p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">
                  Why It Exists
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  The platform is designed as a production-style learning project that combines API
                  integration, state management, backend CRUD, authentication and user experience in
                  one system.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {platformStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/12 bg-gradient-to-br from-cyan-400/12 to-blue-500/12 p-5"
              >
                <p className="text-3xl font-black text-white md:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[32px] border border-white/12 bg-slate-950/70 p-5 backdrop-blur-sm sm:p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/12 bg-black/25 p-5">
            <h2 className="text-xl font-semibold text-white">Feedback</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              If you find a bug, want a UI improvement, or have an idea for a feature, share it
              with context. Mention the page, action and expected result so the issue can be
              reproduced and fixed cleanly.
            </p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-black/25 p-5">
            <h2 className="text-xl font-semibold text-white">Contact Us</h2>
            <div className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
              <p>Email: support@cinepulse.app</p>
              <p>Feedback: feedback@cinepulse.app</p>
              <p>Phone: +91 98765 43210</p>
              <p>Working Hours: Mon - Sat, 10:00 AM to 7:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 rounded-[32px] border border-white/12 bg-slate-950/75 px-5 py-6 text-sm text-slate-300 backdrop-blur-sm sm:px-6 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-black uppercase tracking-[0.14em] text-white">CinePulse</p>
            <p className="mt-3 leading-7">
              A full-stack movie platform focused on discovery, search, trailers and account-based
              personalization.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">
              Contact
            </p>
            <div className="mt-3 space-y-2 leading-7">
              <p>Email: support@cinepulse.app</p>
              <p>Phone: +91 98765 43210</p>
              <p>Location: Movie Platform Studio, India</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">
              Response Channels
            </p>
            <div className="mt-3 space-y-2 leading-7">
              <p>Product feedback: product@cinepulse.app</p>
              <p>Bug reports: feedback@cinepulse.app</p>
              <p>Support hours: Mon - Sat</p>
            </div>
          </div>
        </div>
      </footer>
    </PageFrame>
  );
}
