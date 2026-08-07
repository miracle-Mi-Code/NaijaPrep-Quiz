import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-rose-500/30 bg-slate-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 font-bold text-2xl mb-4 border border-rose-500/20">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-400 mb-4">
              An unexpected error occurred while running the application.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-3 text-left text-xs font-mono text-rose-300 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-bold text-slate-950 shadow-md hover:from-emerald-400 hover:to-teal-300 transition"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="w-full rounded-xl border border-slate-800 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Clear Cache & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
