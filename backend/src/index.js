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

// ── Serve React frontend in production ────────────────────────────────────────
const publicDir = path.join(__dirname, '..', 'public');

if (isProduction && fs.existsSync(publicDir)) {
    console.log(`Serving static files from: ${publicDir}`);
    // Serve static assets (JS, CSS, images)
    app.use(express.static(publicDir));

    // SPA fallback – every non-API route serves index.html so React Router works
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicDir, 'index.html'));
    });
} else if (isProduction && !fs.existsSync(publicDir)) {
    console.warn(`⚠️  WARNING: Public directory not found at ${publicDir}`);
    console.warn('The frontend build may have failed. Serving API only.');
    // Development root – just a hint
    app.get('/', (_req, res) => {
        res.json({
            message: 'NaijaPrep API running. Frontend not available.',
            warning: 'Public directory not found. Check build logs.'
        });
    });
} else {
    // Development root – just a hint
    app.get('/', (_req, res) => {
        res.json({ message: 'NaijaPrep API running. Frontend served separately in dev mode.' });
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
