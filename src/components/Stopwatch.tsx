import { useState, useEffect } from 'react';
import { Play, Square, Pause } from 'lucide-react';

export function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let intervalId: number;
    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isPaused]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  };

  const formatTime = () => {
    const minutes = Math.floor((time / 60000) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor((time / 10) % 100);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow-sm">
      <div className="text-4xl font-mono text-black">{formatTime()}</div>
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
          >
            <Play className="w-5 h-5" />
            Start
          </button>
        ) : (
          <>
            <button
              onClick={handlePauseResume}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Pause className="w-5 h-5" />
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}