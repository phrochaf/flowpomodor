// client/src/TimerView.js

import React, { useState, useEffect, useRef } from 'react';

function TimerView({ user }) {
  // --- STATE ---
  const [timerMode, setTimerMode] = useState('focus'); 
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFlowMode, setIsFlowMode] = useState(false);

  
  const intervalRef = useRef(null);

  // --- EFFECT with CORRECTED Flow Mode Logic ---
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          // If we are already in Flow Mode, just count up.
          if (isFlowMode) {
            return prevTime + 1;
          }

          // THE FIX: Check if this is the final tick of the countdown.
          if (prevTime === 1) {
            // If it is, decide what to do next...
            if (timerMode === 'focus') {
              setIsFlowMode(true); // Enter Flow Mode immediately
            } else {
              handleReset(); // Or reset if it was a break
            }
            return 0; // And set the clock to 0.
          }
          
          // Otherwise, just keep counting down normally.
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isFlowMode, timerMode]);


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

  const handleSetTestTime = () => {
    setIsActive(false);
    setIsFlowMode(false);
    setTime(3);
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
        <button onClick={handleSetTestTime} style={{ marginLeft: '10px' }}>3s Test Time</button>
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