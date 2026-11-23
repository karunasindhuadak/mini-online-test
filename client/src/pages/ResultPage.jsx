import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

export default function ResultPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await API.get(`/tests/${id}`);
        setAttempt(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/history" className="text-indigo-600 hover:underline font-medium">
          ← Back to History
        </Link>
      </div>
    );
  }

  if (!attempt) return null;

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const labels = ['A', 'B', 'C', 'D'];

  // Score badge color
  let scoreColor = 'from-green-500 to-emerald-600'; // ≥ 70%
  if (percentage < 40) scoreColor = 'from-red-500 to-rose-600';
  else if (percentage < 70) scoreColor = 'from-yellow-500 to-orange-500';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Score card */}
      <div className={`bg-gradient-to-br ${scoreColor} rounded-2xl p-8 text-white mb-8 shadow-lg text-center`}>
        <h1 className="text-2xl font-bold mb-2">Test Results</h1>
        <div className="text-6xl font-bold mb-2">
          {attempt.score}/{attempt.totalQuestions}
        </div>
        <p className="text-lg opacity-90">{percentage}% Score</p>
        <p className="text-sm opacity-75 mt-2">
          {new Date(attempt.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Answer breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Results</h2>

        {attempt.answers.map((ans, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl border-2 p-5 transition-all ${
              ans.isCorrect
                ? 'border-green-200 bg-green-50/30'
                : 'border-red-200 bg-red-50/30'
            }`}
          >
            {/* Question header */}
            <div className="flex items-start gap-3 mb-4">
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  ans.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-gray-800 font-medium">{ans.questionText}</h3>
                <span
                  className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    ans.isCorrect
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {ans.isCorrect ? '✓ Correct' : '✗ Wrong'}
                </span>
              </div>
            </div>

            {/* Options breakdown */}
            <div className="grid gap-2 ml-11">
              {ans.options.map((option, optIdx) => {
                const isCorrect = optIdx === ans.correctAnswer;
                const isSelected = optIdx === ans.selectedAnswer;
                const wasWrong = isSelected && !ans.isCorrect;

                let optionClasses = 'border-gray-200 text-gray-600';
                if (isCorrect) optionClasses = 'border-green-400 bg-green-50 text-green-800 font-medium';
                if (wasWrong) optionClasses = 'border-red-400 bg-red-50 text-red-800 font-medium';

                return (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 text-sm ${optionClasses}`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect
                          ? 'bg-green-500 text-white'
                          : wasWrong
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {labels[optIdx]}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isSelected && isCorrect && <span className="text-green-600 text-xs font-semibold">✓ Your Answer (Correct)</span>}
                    {isCorrect && !isSelected && <span className="text-green-600 text-xs font-semibold">✓ Correct Answer</span>}
                    {wasWrong && <span className="text-red-600 text-xs font-semibold">✗ Your Answer</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 pb-8">
        <Link
          to="/test"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Take Another Test
        </Link>
        <Link
          to="/history"
          className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
        >
          View History
        </Link>
        <Link
          to="/"
          className="bg-white text-gray-600 border-2 border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
