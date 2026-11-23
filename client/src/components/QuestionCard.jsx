export default function QuestionCard({
  index,
  question,
  selectedAnswer,
  onSelect,
  disabled = false,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
      <div className="flex gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
          {index + 1}
        </span>
        <h3 className="text-gray-800 font-medium leading-relaxed pt-0.5">
          {question.questionText}
        </h3>
      </div>

      <div className="grid gap-2 ml-11">
        {question.options.map((option, optIdx) => {
          const isSelected = selectedAnswer === optIdx;
          const labels = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={optIdx}
              onClick={() => !disabled && onSelect(question._id, optIdx)}
              disabled={disabled}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm
                ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-medium'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700'
                }
                ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
              `}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${
                    isSelected
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }
                `}
              >
                {labels[optIdx]}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
