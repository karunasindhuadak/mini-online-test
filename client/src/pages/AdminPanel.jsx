import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function AdminPanel() {
  // ── Form state ──
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Questions list ──
  const [questions, setQuestions] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await API.get('/questions/all');
      setQuestions(data);
    } catch (err) {
      setListError(err.response?.data?.message || 'Failed to load questions');
    } finally {
      setListLoading(false);
    }
  };

  const handleOptionChange = (idx, value) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setFormError('');
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!questionText.trim()) {
      setFormError('Question text is required');
      return;
    }
    if (options.some((o) => !o.trim())) {
      setFormError('All 4 options must be filled');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await API.post('/questions', {
        questionText: questionText.trim(),
        options: options.map((o) => o.trim()),
        correctAnswer,
      });
      setQuestions((prev) => [data, ...prev]);
      setFormSuccess('Question added successfully!');
      resetForm();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await API.delete(`/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

      {/* ── Add Question Form ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Question</h2>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleAddQuestion} className="space-y-5">
          {/* Question text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Question Text
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="Enter the question…"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options (select the correct one)
            </label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === idx}
                    onChange={() => setCorrectAnswer(idx)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-bold text-gray-500 w-5">{labels[idx]}</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    placeholder={`Option ${labels[idx]}`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Select the radio button next to the correct answer.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Adding…' : 'Add Question'}
          </button>
        </form>
      </div>

      {/* ── Existing Questions ── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Questions ({questions.length})
        </h2>

        {listLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : listError ? (
          <p className="text-red-500 text-sm">{listError}</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No questions yet. Add one above!</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q._id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm mb-2">
                      {idx + 1}. {q.questionText}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {q.options.map((opt, optIdx) => (
                        <span
                          key={optIdx}
                          className={`text-xs px-2 py-1 rounded ${
                            optIdx === q.correctAnswer
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {labels[optIdx]}. {opt}
                          {optIdx === q.correctAnswer && ' ✓'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Delete question"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
