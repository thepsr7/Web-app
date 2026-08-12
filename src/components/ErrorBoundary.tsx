import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in app:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Something went wrong</h1>
              <p className="text-xs text-slate-400">
                An unexpected error occurred. Click below to reset state and refresh the application.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] font-mono text-red-400 overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Cache & Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
