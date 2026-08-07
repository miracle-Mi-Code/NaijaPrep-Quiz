const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, subject, duration_minutes
       FROM quizzes
       ORDER BY subject, title`
        );

        const grouped = result.rows.reduce((acc, quiz) => {
            acc[quiz.subject] = acc[quiz.subject] || [];
            acc[quiz.subject].push(quiz);
            return acc;
        }, {});

        res.json(grouped);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load quizzes.' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const quizResult = await pool.query(
            'SELECT id, title, subject, duration_minutes FROM quizzes WHERE id = $1',
            [id]
        );

        if (quizResult.rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }

        const questionResult = await pool.query(
            `SELECT id, question_text, options
       FROM questions
       WHERE quiz_id = $1
       ORDER BY id`,
            [id]
        );

        res.json({
            quiz: quizResult.rows[0],
            questions: questionResult.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load quiz questions.' });
    }
});

router.post('/:id/submit', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body || {};
    const userId = req.user.id;
    const userAnswers = answers || {};

    try {
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ message: 'User session expired or user not found. Please log out and log back in.' });
        }

        const quiz = await pool.query(
            'SELECT id, title, duration_minutes FROM quizzes WHERE id = $1',
            [id]
        );

        if (quiz.rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }

        const questions = await pool.query(
            `SELECT id, correct_option
       FROM questions
       WHERE quiz_id = $1`,
            [id]
        );

        const totalQuestions = questions.rows.length;
        let score = 0;
        const review = questions.rows.map((question) => {
            const selectedOption = userAnswers[question.id];

            if (selectedOption === question.correct_option) {
                score += 1;
            }

            return {
                questionId: question.id,
                correctOption: question.correct_option,
                selectedOption: selectedOption || null,
                isCorrect: selectedOption === question.correct_option,
            };
        });

        const percentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);

        await pool.query(
            `INSERT INTO attempts (user_id, quiz_id, score, total_questions, completed_at)
       VALUES ($1, $2, $3, $4, NOW())`,
            [userId, id, score, totalQuestions]
        );

        res.json({
            quizId: Number(id),
            score,
            totalQuestions,
            percentage,
            review,
        });
    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({ message: error.message || 'Failed to submit quiz.' });
    }
});

module.exports = router;
