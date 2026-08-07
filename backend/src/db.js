const { Pool } = require('pg');
require('dotenv').config();

// Render PostgreSQL (and Neon) require SSL in production
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
    console.error('Please configure DATABASE_URL in your Render dashboard or .env file');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false }
        : process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=req')
            ? { rejectUnauthorized: false }
            : false,
});

pool.on('error', (err) => {
    console.error('❌ Unexpected PostgreSQL client error:', err.message);
    console.error('Connection details may be incorrect. Check DATABASE_URL.');
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL connection established');
});

module.exports = { pool };
