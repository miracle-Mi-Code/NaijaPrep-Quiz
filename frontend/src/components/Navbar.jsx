import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            N
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">NaijaPrep Quiz</h1>
            <p className="text-xs text-emerald-400 font-medium">JAMB • WAEC • Post-UTME</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">{user.username}</span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
