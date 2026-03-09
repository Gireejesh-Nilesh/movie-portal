import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PageFrame from "../../components/common/PageFrame";
import { discoverApi } from "../../services/backend/discoverApi";

export default function PersonDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const stateItem = location.state?.item;
  const [item, setItem] = useState(stateItem || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadPersonDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await discoverApi.personDetails(id);
        if (!active) return;
        setItem(response?.data?.person || null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load person details");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPersonDetails();

    return () => {
      active = false;
    };
  }, [id]);

  const profileUrl = useMemo(() => {
    if (item?.profileUrl) return item.profileUrl;
    if (item?.profilePath?.startsWith("http")) return item.profilePath;
    if (item?.profilePath) return `https://image.tmdb.org/t/p/w780${item.profilePath}`;
    return null;
  }, [item]);

  return (
    <PageFrame tone="blue">
      <div className="mt-8 rounded-[30px] border border-white/12 bg-black/35 p-5 backdrop-blur-sm md:p-7">
        <Link to="/" className="text-sm text-cyan-300 hover:text-cyan-200">
          Back to Home
        </Link>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        {loading && <p className="mt-4 text-sm text-slate-300">Loading details...</p>}

        <div className="mt-5 grid gap-6 md:grid-cols-[260px_1fr]">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900">
            {profileUrl ? (
              <img src={profileUrl} alt={item?.name || `Person ${id}`} className="h-full w-full object-cover" />
            ) : (
              <div className="grid aspect-[3/4] place-items-center text-sm text-slate-300">
                Image Not Available
              </div>
            )}
          </div>

          <div>
            <p className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
              Person Profile
            </p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">{item?.name || `Person ${id}`}</h1>
            <p className="mt-3 text-sm text-slate-300 md:text-base">
              {item?.biography || item?.overview || "Biography not available."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                Known For: {item?.knownForDepartment || "Artist"}
              </span>
              {item?.birthday && (
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  Born: {item.birthday}
                </span>
              )}
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">ID: {id}</span>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
