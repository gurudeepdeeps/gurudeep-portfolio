import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ERROR_BOUNDARY] Uncaught runtime exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-[#100d25]/90 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6 shadow-lg shadow-red-500/10">
              <AlertTriangle size={32} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold mb-3">
              <ShieldAlert size={14} /> Application Error
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Something went wrong
            </h1>

            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              An unexpected client-side error occurred while rendering this view. Your session and device data remain secure.
            </p>

            {this.state.error && (
              <div className="w-full mb-6 p-4 rounded-xl bg-black/40 border border-white/5 text-left text-xs text-red-300/80 font-mono break-words overflow-x-auto max-h-32">
                {this.state.error.message || "Unknown error"}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={this.handleReload}
                className="flex-1 min-w-[140px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} /> Reload Page
              </button>

              <a
                href="/"
                className="flex-1 min-w-[140px] py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Home size={16} /> Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
