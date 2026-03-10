import skullLogo from "../../assets/logo/skull.png";

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <img
        src={skullLogo}
        alt="loading"
        className="loader-skull w-28 md:w-36"
      />
    </div>
  );
}