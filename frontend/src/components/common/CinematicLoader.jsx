export default function CinematicLoader({ label = "Loading..." }) {
  return (
    <div className="loader-fade grid place-items-center py-10">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-cyan-300/30 bg-cyan-400/10 backdrop-blur-sm" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-300 border-r-blue-400 animate-spin" />
          <div className="absolute inset-[14px] rounded-full bg-[radial-gradient(circle,#67e8f9_0%,rgba(34,211,238,0.15)_45%,transparent_70%)] blur-[1px]" />
        </div>
        <p className="text-sm tracking-[0.18em] text-cyan-100/85 uppercase">{label}</p>
      </div>
    </div>
  );
}
