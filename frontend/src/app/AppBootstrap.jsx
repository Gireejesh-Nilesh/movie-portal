import { useEffect } from "react";
import CinematicLoader from "../components/common/CinematicLoader";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchMeThunk } from "../features/auth/authThunks";

export default function AppBootstrap({ children }) {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.2),transparent_35%),linear-gradient(180deg,#020617,#06143a)]">
        <CinematicLoader label="Checking session" />
      </div>
    );
  }

  return children;
}
