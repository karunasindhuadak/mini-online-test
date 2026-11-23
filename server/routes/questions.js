import express from 'express';
import Question from '../models/Question.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// get 10 random questions for a test (without correct answers)
router.get('/', protect, async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    if (totalQuestions === 0) {
      return res.status(404).json({ message: 'No questions available. Please ask an admin to add questions.' });
    }

    const sampleSize = Math.min(10, totalQuestions);
    const questions = await Question.aggregate([{ $sample: { size: sampleSize } }]);

    // remove correct answers so students can't see them
    const sanitized = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all questions with answers (admin only)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add a new question (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !options || correctAnswer === undefined || correctAnswer === null) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Exactly 4 options are required' });
    }

    if (options.some((opt) => !opt || !opt.trim())) {
      return res.status(400).json({ message: 'All options must be non-empty' });
    }

    const idx = Number(correctAnswer);
    if (isNaN(idx) || idx < 0 || idx > 3) {
      return res.status(400).json({ message: 'Correct answer must be an index between 0 and 3' });
    }

    const question = await Question.create({
      questionText: questionText.trim(),
      options: options.map((o) => o.trim()),
      correctAnswer: idx,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a question (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await question.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
