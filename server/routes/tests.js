import express from 'express';
import Question from '../models/Question.js';
import TestAttempt from '../models/TestAttempt.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// submit test answers and get scored result
router.post('/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    // answers = [{ questionId: "...", selectedAnswer: 0-3 }, ...]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'No answers provided' });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length === 0) {
      return res.status(400).json({ message: 'No valid questions found' });
    }

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    let score = 0;
    const processedAnswers = [];

    for (const ans of answers) {
      const question = questionMap[ans.questionId];
      if (!question) continue;

      const selected = Number(ans.selectedAnswer);
      const isCorrect = question.correctAnswer === selected;
      if (isCorrect) score++;

      processedAnswers.push({
        question: question._id,
        questionText: question.questionText,
        options: question.options,
        selectedAnswer: selected,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    }

    const attempt = await TestAttempt.create({
      user: req.user._id,
      answers: processedAnswers,
      score,
      totalQuestions: processedAnswers.length,
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all test attempts for the logged-in user
router.get('/history', protect, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .select('score totalQuestions createdAt')
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a specific test attempt with full details
router.get('/:id', protect, async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Test attempt not found' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
