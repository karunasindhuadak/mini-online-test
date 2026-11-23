import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Hello, {user?.name}!</h1>
        <p className="text-indigo-100 text-lg">
          Ready to test your knowledge? Take a quick 10-question quiz and see how you score.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Start test card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a Test</h2>
          <p className="text-gray-500 text-sm mb-6 flex-1">
            Answer 10 multiple-choice questions in 10 minutes. Your score is calculated instantly.
          </p>
          <Link
            to="/test"
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Start Test
          </Link>
        </div>

        {/* History card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">View History</h2>
          <p className="text-gray-500 text-sm mb-6 flex-1">
            Review your past test attempts, scores, and detailed answer breakdowns.
          </p>
          <Link
            to="/history"
            className="inline-flex items-center justify-center bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            View History
          </Link>
        </div>
      </div>

      {/* Test rules */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Test Rules</h3>
        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
          <li>Each test has <strong>10 multiple-choice questions</strong></li>
          <li>You have <strong>10 minutes</strong> to complete the test</li>
          <li>The test <strong>auto-submits</strong> when the timer runs out</li>
          <li>Results with correct answers are shown immediately after submission</li>
        </ul>
      </div>
    </div>
  );
}
