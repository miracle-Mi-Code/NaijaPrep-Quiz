import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import QuizSession from './components/QuizSession';
import QuizResult from './components/QuizResult';
import { api } from './services/api';
import { useQuizTimer } from './hooks/useQuizTimer';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [quizzes, setQuizzes] = useState({});
  const [dashboard, setDashboard] = useState(null);

  // Active quiz state
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const timer = useQuizTimer(selectedQuiz?.duration_minutes || 0);

  useEffect(() => {
    if (token) {
      loadDashboard();
      loadQuizzes();
    }
  }, [token]);

  // Handle auto-submit on timer expiration
  useEffect(() => {
    if (timer.isExpired && selectedQuiz && !result && questions.length > 0) {
      handleSubmitQuiz();
    }
  }, [timer.isExpired, selectedQuiz, result, questions]);

  const loadQuizzes = async () => {
    try {
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setDashboard(null);
    setQuizzes({});
    setSelectedQuiz(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
  };

  const handleStartQuiz = async (quiz) => {
    setError('');
    setLoading(true);
    setSelectedQuiz(quiz);
    setResult(null);
    setAnswers({});

    try {
      const data = await api.getQuiz(quiz.id);
      setQuestions(data.questions);
    } catch (err) {
      setError(err.message || 'Failed to start quiz session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;
    setLoading(true);

    try {
      const res = await api.submitQuiz(selectedQuiz.id, answers);
      setResult(res);
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to submit quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnDashboard = () => {
    setSelectedQuiz(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs underline hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {!token || !user ? (
          <AuthScreen onAuthSuccess={handleAuthSuccess} api={api} />
        ) : result ? (
          <QuizResult
            result={result}
            quiz={selectedQuiz}
            questions={questions}
            onReturnDashboard={handleReturnDashboard}
          />
        ) : selectedQuiz ? (
          loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">
              Loading exam questions...
            </div>
          ) : (
            <QuizSession
              quiz={selectedQuiz}
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
              onSubmit={handleSubmitQuiz}
              timer={timer}
            />
          )
        ) : (
          <Dashboard
            dashboard={dashboard}
            quizzes={quizzes}
            onStartQuiz={handleStartQuiz}
          />
        )}
      </main>
    </div>
  );
}
