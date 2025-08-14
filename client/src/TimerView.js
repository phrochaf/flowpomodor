// client/src/TimerView.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CirclePicker } from 'react-color';
import { db } from './firebase';
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import TallyMarks from './TallyMarks';

// The AddCategoryModal component remains the same...
function AddCategoryModal({ onClose, user, existingCategories, isProUser }) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#4ade80');

  const handleColorChange = (color) => {
    setCategoryColor(color.hex);
  };

  const handleSave = async () => {
    if (!isProUser && existingCategories.length >= 2) {
      alert('You need to upgrade to Pro to add more than 2 categories!');
      return;
    }
    if (!categoryName || !user) return;
    const newCategory = { name: categoryName, color: categoryColor };
    const updatedCategories = [...existingCategories, newCategory];
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { categories: updatedCategories }, { merge: true });
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Create New Category</h2>
        <div className="mb-4">
          <label htmlFor='categoryName' className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
          <input className='w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type='text' id='categoryName' value={categoryName} onChange={(e) => {setCategoryName(e.target.value)}} placeholder="e.g., Programming"/>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Sphere Color</label>
          <CirclePicker color={categoryColor} onChangeComplete={handleColorChange} />
        </div>
        <div className='flex justify-end gap-4'>
          <button className='px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors' onClick={onClose}>Cancel</button>
          <button className='px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors' onClick={handleSave} >Save</button>
        </div>
      </div>
    </div>
  );
}


function TimerView({ user, categories }) {
  // --- STATE ---
  const [timerMode, setTimerMode] = useState('focus'); 
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFlowMode, setIsFlowMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Our new accurate stopwatch
  const [currentPage, setCurrentPage] = useState(0);

  const isProUser = false;
  
  const intervalRef = useRef(null);
  // --- HANDLERS ---
  const handleOpenModal = () => { setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); };
  
  const handleSelectCategory = (category) => {
    if (selectedCategory?.name === category.name) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Your new, more accurate saveSession function
  const saveSession = useCallback(async () => {
    if (!user || timerMode !== 'focus' || elapsedTime < 1) {
      return;
    }
    const sessionData = {
      userId: user.uid,
      category: selectedCategory ? selectedCategory.name : 'Uncategorized',
      duration: elapsedTime,
      timestamp: Date.now(),
    };
    try {
      await addDoc(collection(db, 'sessions'), sessionData);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [user, timerMode, elapsedTime, selectedCategory]);

  // Your new handleStart function
  const handleStart = () => { 
    if (time <= 0 && !isFlowMode) return;    
    setIsActive(true);
  };

  const handlePause = () => { 
    setIsActive(false); 
  };

  // The functions that end a work block
  const handleReset = useCallback(() => {
    saveSession();
    setElapsedTime(0);
    setIsActive(false);
    setIsFlowMode(false);
    if (timerMode === 'focus') { setTime(25*60); } 
    else if (timerMode === 'shortBreak') { setTime(5 * 60); } 
    else if (timerMode === 'longBreak') { setTime(15 * 60); }
  }, [timerMode, saveSession]);
  
  const switchMode = useCallback((mode) => {
    saveSession();
    setElapsedTime(0);
    setIsActive(false);
    setIsFlowMode(false);
    setTimerMode(mode);
    if (mode === 'focus') { setTime(25*60); } 
    else if (mode === 'shortBreak') { setTime(5 * 60); } 
    else if (mode === 'longBreak') { setTime(15 * 60); }
  }, [saveSession]);

  const handleNextPage = () => {
    const totalPages = Math.ceil(categories.length/3);
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }
  
  // --- EFFECTS ---
  // Effect for the timer logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        // We only track elapsed time during a focus session.
        if (timerMode === 'focus') {
          setElapsedTime(prev => prev + 1);
        }

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
  }, [isActive, isFlowMode, timerMode, handleReset]);



  const categoriesToShow = categories.slice(currentPage * 3, (currentPage + 1) * 3);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  

  const mainButtonBaseClasses = 'px-16 py-4 rounded-lg text-white text-xl font-bold uppercase tracking-wider shadow-lg transition-all transform hover:scale-105';

  return (
    <>
      <TallyMarks elapsedTime={elapsedTime} />
      {/* The Main Timer Card */}
      <div className="bg-gray-800 text-white shadow-2xl p-8 w-full max-w-md mx-auto rounded-2xl flex flex-col items-center">
        <div className="bg-gray-900 p-1 rounded-full flex items-center gap-2 mb-8">
          <button className={`px-4 py-2 rounded-full font-semibold transition-colors ${timerMode === 'focus' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`} onClick={() => switchMode('focus')}>Focus</button>
          <button className={`px-4 py-2 rounded-full font-semibold transition-colors ${timerMode === 'shortBreak' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`} onClick={() => switchMode('shortBreak')}>Short Break</button>
          <button className={`px-4 py-2 rounded-full font-semibold transition-colors ${timerMode === 'longBreak' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`} onClick={() => switchMode('longBreak')}>Long Break</button>
        </div>
        <div className={`text-8xl font-bold my-8 transition-colors ${isFlowMode ? 'text-green-400' : 'text-white'}`}>{formatTime(time)}</div>
        <div className="mb-4">
          {isFlowMode ? (<button className={`${mainButtonBaseClasses} bg-red-600 hover:bg-red-500`} onClick={handleReset}>Finish</button>) : (!isActive ? (<button className={`${mainButtonBaseClasses} bg-green-600 hover:bg-green-500`} onClick={handleStart}>Start</button>) : (<button className={`${mainButtonBaseClasses} bg-yellow-500 hover:bg-yellow-400`} onClick={handlePause}>Pause</button>))}
        </div>
        <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-full shadow-md transition-colors" onClick={handleReset}>Reset</button>
        {isFlowMode && <p className="text-green-400 mt-8 font-semibold">You're in the flow! Keep going!</p>}
      </div>

      {/* The Focus Shelf */}
      <div className="w-full max-w-md mx-auto mt-8 p-4 bg-gray-800 rounded-lg shadow-lg flex items-center gap-4">


        <button 
          onClick={handlePrevPage} 
          className='text-gray-500 hover:text-white disabled:opacity-25'
          disabled={currentPage === 0}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div className="flex-grow flex items-start gap-4 justify-center">
          {categoriesToShow.map((category) => (
            <div key={category.name} className={`flex flex-col items-center gap-2 w-24 p-2 ${selectedCategory?.name === category.name ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
              <button onClick={() => handleSelectCategory(category)} className='w-8 h-8 rounded-full shadow-md transition-all hover:scale-110' style={{backgroundColor: category.color, boxShadow: `0 0 10px ${category.color}`}}></button>
              <span className='text-gray-300 text-sm text-center'>{category.name}</span>
            </div>
          ))}
        </div>

          <button 
          onClick={handleNextPage} 
          className='text-gray-500 hover:text-white disabled:opacity-25'
          disabled={currentPage === Math.ceil(categories.length/3) - 1}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        

      </div>
      {/* The Add Category Button */}
      {isProUser || categories.length < 2 ? (
      <div className='flex justify-center mt-4'>
          <button className='flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-600 rounded-full text-gray-600 hover:border-gray-500 hover:text-gray-500 transition-colors' onClick={handleOpenModal}>
            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      ) : (
        <div className='flex justify-center mt-4'>
          <p className='text-gray-400'>Add more categories with Pro!</p>
          <button className='px-3 py-1 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md ml-2'>Upgrade Now</button>
        </div>
      )}
      {isModalOpen && <AddCategoryModal onClose={handleCloseModal} user={user} existingCategories={categories} isProUser={isProUser}/>}
    </>
  );
}

export default TimerView;