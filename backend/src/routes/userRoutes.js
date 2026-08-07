const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const attemptsResult = await pool.query(
            `SELECT a.id, a.score, a.total_questions, a.completed_at, q.title, q.subject
       FROM attempts a
       JOIN quizzes q ON q.id = a.quiz_id
       WHERE a.user_id = $1
       ORDER BY a.completed_at DESC`,
            [userId]
        );

        const statsResult = await pool.query(
            `SELECT
         COUNT(*) AS completed_quizzes,
         ROUND(AVG((score::numeric / total_questions) * 100), 2) AS average_score
       FROM attempts
       WHERE user_id = $1`,
            [userId]
        );

        res.json({
            attempts: attemptsResult.rows,
            stats: statsResult.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load dashboard.' });
    }
});

module.exports = router;
