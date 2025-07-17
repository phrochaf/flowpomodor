// client/src/TimerView.js

import React, { useState, useEffect, useRef } from 'react';

function TimerView({ user }) {
  // --- STATE ---
  const [timerMode, setTimerMode] = useState('focus'); 
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  
  const intervalRef = useRef(null);

  // --- EFFECT ---
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime >= 1) {
            return prevTime - 1;
          }
          // When time hits 0, reset the timer for now.
          handleReset(); 
          return 0;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);


  // --- HANDLER FUNCTIONS ---
  const handleStart = () => {
    if (time > 0) {
      setIsActive(true);
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    // We call your new switchMode function to make sure the reset
    // goes to the correct time for the current mode.
    switchMode(timerMode); 
  };
  
  // Your switchMode function!
  const switchMode = (mode) => {
    setIsActive(false);
    setTimerMode(mode);
    
    if (mode === 'focus') {
      setTime(25 * 60);
    } else if (mode === 'shortBreak') {
      setTime(5 * 60);
    } else if (mode === 'longBreak') {
      setTime(15 * 60);
    }
  };

  // Helper function to format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Your new mode buttons! */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => switchMode('focus')}>Focus</button>
        <button onClick={() => switchMode('shortBreak')} style={{ marginLeft: '10px' }}>Short Break</button>
        <button onClick={() => switchMode('longBreak')} style={{ marginLeft: '10px' }}>Long Break</button>
      </div>

      <div style={{ fontSize: '4rem', margin: '20px' }}>
        {formatTime(time)}
      </div>
      
      {!isActive ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <button onClick={handlePause}>Pause</button>
      )}

      <button onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>

      <p style={{ marginTop: '20px' }}>Current Mode: <strong>{timerMode}</strong></p>
    </div>
  );
}

export default TimerView;