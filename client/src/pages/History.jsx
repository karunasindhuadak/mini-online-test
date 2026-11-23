import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/tests/history');
        setAttempts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
        <Link
          to="/test"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + New Test
        </Link>
      </div>

      {attempts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Tests Yet</h2>
          <p className="text-gray-500 mb-6">You haven&apos;t taken any tests yet. Start one now!</p>
          <Link
            to="/test"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Start a Test
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt, idx) => {
            const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
            let badge = 'bg-green-100 text-green-700';
            if (percentage < 40) badge = 'bg-red-100 text-red-700';
            else if (percentage < 70) badge = 'bg-yellow-100 text-yellow-700';

            return (
              <Link
                key={attempt._id}
                to={`/result/${attempt._id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      #{attempts.length - idx}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        Test Attempt #{attempts.length - idx}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {attempt.score}/{attempt.totalQuestions}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
                        {percentage}%
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
