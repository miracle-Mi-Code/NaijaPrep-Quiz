const { Pool } = require('pg');
require('dotenv').config();

// Check if environment is production or hosted on cloud (Render / Neon / Supabase)
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER || !!process.env.RENDER_SERVICE_ID;
const isRemoteDb = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1');
const shouldUseSSL = isProduction || isRemoteDb || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=req'));

if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
    console.error('Please configure DATABASE_URL in your Render dashboard or .env file');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
    console.error('❌ Unexpected PostgreSQL client error:', err.message);
    console.error('Connection details may be incorrect. Check DATABASE_URL.');
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL connection established');
});

module.exports = { pool };
