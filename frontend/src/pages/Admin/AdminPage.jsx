import { useAppSelector } from "../../app/hooks";
import PageFrame from "../../components/common/PageFrame";

export default function AdminPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <PageFrame tone="orange">
      <section className="mt-8 rounded-[28px] border border-white/12 bg-black/40 p-5 backdrop-blur-sm md:p-7">
        <p className="inline-flex rounded-full border border-amber-300/35 bg-amber-400/12 px-3 py-1 text-xs text-amber-100">
          Admin Access
        </p>
        <h1 className="mt-4 text-3xl font-black md:text-4xl">Dashboard Control Room</h1>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Logged in as {user?.name || "Admin"}. Manage movies, users, moderation and reports from one place.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Movies", desc: "Add / Edit / Delete catalog entries" },
            { title: "Users", desc: "View all users and account states" },
            { title: "Moderation", desc: "Ban or remove abusive accounts" },
            { title: "Reports", desc: "Monitor platform activity quickly" },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/15 bg-slate-900/70 p-4"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-xs text-slate-300">{card.desc}</p>
              <button className="mt-4 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10">
                Open
              </button>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/12 bg-slate-900/60 p-4">
          <p className="text-sm text-slate-200">
            Next step: wire these blocks to admin APIs for movie CRUD and user management actions.
          </p>
        </div>
      </section>
    </PageFrame>
  );
}
