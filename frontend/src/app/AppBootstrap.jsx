import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { fetchMeThunk } from "../features/auth/authThunks";

export default function AppBootstrap({ children }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  return children;
}
