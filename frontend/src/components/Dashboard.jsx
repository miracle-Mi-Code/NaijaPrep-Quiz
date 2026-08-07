import React, { useState } from 'react';

export default function Dashboard({ dashboard, quizzes, onStartQuiz }) {
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = ['All', ...Object.keys(quizzes || {})];

  const filteredQuizzes = selectedSubject === 'All'
    ? Object.entries(quizzes || {}).flatMap(([subj, list]) => list)
    : quizzes[selectedSubject] || [];

  const completedCount = dashboard?.stats?.completed_quizzes || 0;
  const avgScore = dashboard?.stats?.average_score ? Number(dashboard.stats.average_score).toFixed(1) : 0;
  const attempts = dashboard?.attempts || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-emerald-500/20 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            ✨ Exam Readiness Hub
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Master JAMB & WAEC Quizzes
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Select a subject below to take a timed practice session with server-evaluated scoring.
          </p>
        </div>
      </div>

      {/* Performance Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Quizzes</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{completedCount}</span>
            <span className="text-xs text-emerald-400 font-medium">sessions finished</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Performance</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{avgScore}%</span>
            <span className="text-xs text-teal-400 font-medium">overall score</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total History Recorded</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{attempts.length}</span>
            <span className="text-xs text-indigo-400 font-medium">attempts logged</span>
          </div>
        </div>
      </div>

      {/* Available Quizzes Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Available Practice Quizzes</h3>
            <p className="text-xs text-slate-400 mt-1">Choose a module to start timed evaluation</p>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedSubject === subj
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-5 hover:border-emerald-500/50 hover:bg-slate-950 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-400 border border-emerald-500/20">
                      {quiz.subject}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                      ⏱️ {quiz.duration_minutes} mins
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                    {quiz.title}
                  </h4>
                </div>

                <button
                  onClick={() => onStartQuiz(quiz)}
                  className="mt-5 w-full rounded-xl bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-400 group-hover:text-slate-950 py-2.5 text-xs font-bold text-slate-200 transition-all duration-200 shadow-sm"
                >
                  Start Practice Quiz →
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 col-span-2 text-center py-8">
              No quizzes available under this subject.
            </p>
          )}
        </div>
      </div>

      {/* Attempt History Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Recent Quiz Attempt History</h3>
        {attempts.length > 0 ? (
          <div className="space-y-3">
            {attempts.slice(0, 10).map((attempt) => {
              const scorePct = Math.round((attempt.score / attempt.total_questions) * 100);
              return (
                <div
                  key={attempt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-400">{attempt.subject}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">
                        {new Date(attempt.completed_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h5 className="font-semibold text-white mt-1 text-sm">{attempt.title}</h5>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        {attempt.score} / {attempt.total_questions}
                      </div>
                      <div className={`text-xs font-semibold ${scorePct >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {scorePct}% Score
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            You haven't completed any quizzes yet. Click "Start Practice Quiz" above to take your first test!
          </div>
        )}
      </div>
    </div>
  );
}
