import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected app error",
    };
  }

  componentDidCatch(error) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
          <div className="max-w-lg rounded-2xl border border-red-300/30 bg-red-500/10 p-5 text-center">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-red-100/90">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Reload
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
