import React from 'react';

export default function QuizSession({ quiz, questions, answers, setAnswers, onSubmit, timer }) {
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  const isLowTime = timer.minutes === 0 && timer.seconds < 60;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Sticky Header with Quiz Info & Timer */}
      <div className="sticky top-16 z-40 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {quiz.subject} Quiz Session
            </span>
            <h2 className="text-lg font-bold text-white leading-tight">{quiz.title}</h2>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black border transition-all ${
              isLowTime
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <span>⏱️ Time Left:</span>
            <span className="text-base font-mono">
              {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Progress: {answeredCount} of {totalCount} answered</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Cards */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          let opts = [];
          if (Array.isArray(q.options)) {
            opts = q.options;
          } else if (typeof q.options === 'string') {
            try {
              opts = JSON.parse(q.options);
            } catch {
              opts = [q.options];
            }
          }

          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 md:p-6 transition ${
                answers[q.id]
                  ? 'border-emerald-500/40 bg-slate-900/90 shadow-lg shadow-emerald-500/5'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-xs text-emerald-400 border border-emerald-500/20">
                  {qIndex + 1}
                </span>
                <h3 className="text-base font-semibold text-white leading-snug pt-0.5">
                  {q.question_text}
                </h3>
              </div>

              {/* Radio Options A - D */}
              <div className="grid gap-2.5">
                {opts.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = answers[q.id] === option;

                  return (
                    <label
                      key={optIdx}
                      className={`group flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-white font-medium shadow-md shadow-emerald-500/10'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => setAnswers({ ...answers, [q.id]: option })}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-bold text-xs transition ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm leading-snug">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center">
        <button
          onClick={onSubmit}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.99] transition duration-200"
        >
          Submit Quiz Answers ({answeredCount}/{totalCount} Completed)
        </button>
      </div>
    </div>
  );
}
