import CursorToneManager from "./components/common/CursorToneManager";
import AppErrorBoundary from "./components/common/AppErrorBoundary";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <AppErrorBoundary>
      <CursorToneManager />
      <AppRouter />
    </AppErrorBoundary>
  );
}
