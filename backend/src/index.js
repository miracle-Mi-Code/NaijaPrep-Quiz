const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production the frontend is served by this same Express server, so CORS
// is only needed for local development (separate Vite dev server on port 3000).
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map((o) => o.trim()) : []),
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            // In production, same-origin requests have no Origin header – allow them
            if (isProduction) return callback(null, true);
            callback(new Error(`CORS: origin ${origin} is not allowed`));
        },
        credentials: true,
    })
);

app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);

// ── Serve React frontend (check for public directory first) ────────────────
const publicDir = path.join(__dirname, '..', 'public');
const hasFrontend = fs.existsSync(publicDir) && fs.existsSync(path.join(publicDir, 'index.html'));

if (hasFrontend) {
    console.log(`✅ Serving React frontend from: ${publicDir}`);
    // Serve static assets (JS, CSS, images)
    app.use(express.static(publicDir));

    // SPA fallback – every non-API route serves index.html so React Router works
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicDir, 'index.html'));
    });
} else {
    console.warn(`⚠️  WARNING: Frontend not found. Public directory: ${publicDir}`);
    console.warn('The frontend build may have failed or the public/ folder is missing.');

    // Fallback: serve API only with error message
    app.get('/', (_req, res) => {
        res.status(503).json({
            error: 'Frontend application not available',
            message: 'The frontend build failed or was not deployed.',
            api_status: 'API is operational. Use /api/health to check.',
            hint: 'Check Render build logs.'
        });
    });
}

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
});
