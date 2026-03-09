import CinematicNavbar from "./CinematicNavbar";

export default function PageFrame({
  children,
  tone = "blue",
  className = "",
  contentClassName = "",
  showNavbar = true,
}) {
  return (
    <main data-cursor-tone={tone} className={`min-h-screen bg-black text-white ${className}`}>
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_18%,rgba(24,66,180,0.42),transparent_35%),radial-gradient(circle_at_92%_14%,rgba(14,34,110,0.55),transparent_40%),radial-gradient(circle_at_50%_118%,rgba(60,112,255,0.22),transparent_55%),linear-gradient(180deg,#030712_0%,#040a1c_48%,#020617_100%)] px-5 pb-10 pt-5 md:px-6 md:pt-6">
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(transparent_96%,rgba(255,255,255,0.08)_96%),linear-gradient(90deg,transparent_96%,rgba(255,255,255,0.08)_96%)] [background-size:22px_22px]" />
        <div className={`relative mx-auto max-w-7xl ${contentClassName}`}>
          {showNavbar ? <CinematicNavbar /> : null}
          {children}
        </div>
      </section>
    </main>
  );
}
