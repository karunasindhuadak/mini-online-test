import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});   // { questionId: selectedIndex }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Refs for auto-submit (so the timer callback always has fresh state)
  const answersRef = useRef(answers);
  const questionsRef = useRef(questions);
  const submittingRef = useRef(false);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await API.get('/questions');
        setQuestions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitTest = useCallback(async (isAutoSubmit = false) => {
    // Prevent double submission
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);

    const currentAnswers = answersRef.current;
    const currentQuestions = questionsRef.current;

    // Build submission payload — include unanswered as -1
    const payload = currentQuestions.map((q) => ({
      questionId: q._id,
      selectedAnswer: currentAnswers[q._id] !== undefined ? currentAnswers[q._id] : -1,
    }));

    try {
      const { data } = await API.post('/tests/submit', { answers: payload });
      navigate(`/result/${data._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [navigate]);

  const handleTimeUp = useCallback(() => {
    submitTest(true);
  }, [submitTest]);

  const handleManualSubmit = () => {
    const answered = Object.keys(answers).length;
    if (answered < questions.length) {
      const unanswered = questions.length - answered;
      if (!window.confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`)) {
        return;
      }
    }
    submitTest(false);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading questions…</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error && questions.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Could Not Load Test</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      {/* Sticky header with timer and progress */}
      <div className="sticky top-0 z-10 bg-gray-50 pb-4 pt-1 -mt-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Online Test</h1>
            <p className="text-sm text-gray-500">
              {answeredCount} of {questions.length} answered
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Timer durationSeconds={600} onTimeUp={handleTimeUp} />
            <button
              onClick={handleManualSubmit}
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Submitting…
                </>
              ) : (
                'Submit Test'
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4 mt-4">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q._id}
            index={idx}
            question={q}
            selectedAnswer={answers[q._id]}
            onSelect={handleSelect}
            disabled={submitting}
          />
        ))}
      </div>

      {/* Bottom submit */}
      <div className="mt-8 text-center pb-4">
        <button
          onClick={handleManualSubmit}
          disabled={submitting}
          className="bg-green-600 text-white px-10 py-3 rounded-lg font-medium text-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting…' : 'Submit Test'}
        </button>
      </div>
    </div>
  );
}
