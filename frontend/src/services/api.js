// In production the React app is served by the same Express server,
// so we use a relative path (/api). In local dev VITE_API_URL points to
// the separate Express dev server (http://localhost:5000/api).
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || 'Request failed.');
    }

    return payload;
}

export const api = {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getQuizzes: () => request('/quizzes'),
    getQuiz: (id) => request(`/quizzes/${id}`),
    submitQuiz: (id, answers) => request(`/quizzes/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }),
    getDashboard: () => request('/users/dashboard'),
};
