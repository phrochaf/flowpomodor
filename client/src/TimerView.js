// client/src/TimerView.js

import React, { useState, useEffect, useRef } from 'react';

function TimerView({ user }) {
  const [timerMode, setTimerMode] = useState('focus'); 
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFlowMode, setIsFlowMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const intervalRef = useRef(null);

  // All the useEffect and handler functions remain the same...
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (isFlowMode) { return prevTime + 1; }
          if (prevTime === 1) {
            if (timerMode === 'focus') { setIsFlowMode(true); } 
            else { handleReset(); }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, isFlowMode, timerMode]);

  const handleStart = () => { if (time > 0 || timerMode === 'focus') { setIsActive(true); } };
  const handlePause = () => { setIsActive(false); };
  const handleReset = () => {
    setIsActive(false);
    setIsFlowMode(false);
    switchMode(timerMode); 
  };
  const handleOpenModal = () => {setIsModalOpen(true)};
  const handleCloseModal = () => {setIsModalOpen(false)};



  const switchMode = (mode) => {
    setIsActive(false);
    setIsFlowMode(false);
    setTimerMode(mode);
    if (mode === 'focus') { setTime(25 * 60); } 
    else if (mode === 'shortBreak') { setTime(5 * 60); } 
    else if (mode === 'longBreak') { setTime(15 * 60); }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // --- STYLES ---
  // Your new, minimalistic button style!
  const mainButtonBaseClasses = 'px-16 py-4 rounded-lg text-white text-xl font-bold uppercase tracking-wider shadow-lg transition-all transform hover:scale-105';

  return (
    <div className="bg-gray-800 text-white shadow-2xl p-8 w-full max-w-md mx-auto rounded-2xl flex flex-col items-center">
      
      {/* Mode buttons now use blue instead of indigo */}
      <div className="bg-gray-900 p-1 rounded-full flex items-center gap-2 mb-8">
        <button 
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${timerMode === 'focus' ? 'bg-blue-900 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => switchMode('focus')}
        >
          Focus
        </button>
        <button 
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${timerMode === 'shortBreak' ? 'bg-blue-900 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => switchMode('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${timerMode === 'longBreak' ? 'bg-blue-900 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => switchMode('longBreak')}
        >
          Long Break
        </button>
      </div>

      <div className={`text-8xl font-bold my-8 transition-colors ${isFlowMode ? 'text-green-400' : 'text-white'}`}>
        {formatTime(time)}
      </div>
      
      {/* The main action button now uses your new style */}
      <div className="mb-4"> {/* Added margin-bottom for spacing */}
        {isFlowMode ? (
          <button className={`${mainButtonBaseClasses} bg-red-600 hover:bg-red-500`} onClick={handleReset}>Finish</button>
        ) : (
          !isActive ? (
            <button className={`${mainButtonBaseClasses} bg-green-600 hover:bg-green-500`} onClick={handleStart}>Start</button>
          ) : (
            <button className={`${mainButtonBaseClasses} bg-yellow-500 hover:bg-yellow-400`} onClick={handlePause}>Pause</button>
          )
        )}
      </div>

      <button 
        className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-full shadow-md transition-colors"
        onClick={handleReset}
      >
        Reset
      </button>

      {isFlowMode && <p className="text-green-400 mt-8 font-semibold">You're in the flow! Keep going!</p>}
    </div>
  );
}

export default TimerView;