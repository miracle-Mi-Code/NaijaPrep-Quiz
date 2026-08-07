const { Pool } = require('pg');
require('dotenv').config();

// Render PostgreSQL (and Neon) require SSL in production
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false }
        : process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=req')
            ? { rejectUnauthorized: false }
            : false,
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL client error:', err);
});

module.exports = { pool };
