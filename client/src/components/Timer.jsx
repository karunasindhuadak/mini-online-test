import { useState, useEffect, useRef } from 'react';

export default function Timer({ durationSeconds = 600, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const intervalRef = useRef(null);
  const onTimeUpRef = useRef(onTimeUp);

  // keep callback ref fresh
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [durationSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const isWarning = secondsLeft <= 120 && secondsLeft > 60;
  const isDanger = secondsLeft <= 60;

  let colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (isWarning) colorClasses = 'bg-yellow-50 text-yellow-700 border-yellow-300';
  if (isDanger) colorClasses = 'bg-red-50 text-red-700 border-red-300 animate-pulse';

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-lg font-semibold ${colorClasses}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
