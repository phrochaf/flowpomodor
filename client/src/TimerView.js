// client/src/TimerView.js

import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { CirclePicker } from 'react-color';

function AddCategoryModal ({onClose, user, existingCategories}) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState ('#4ade80');

  const handleSave = async() => {
    if (!categoryName || !user) {
      return;
    }
    
    const newCategory = {name:categoryName, color:categoryColor};
    const updatedCategories = [...existingCategories, newCategory];

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      await setDoc(userDocRef, {categories:updatedCategories}, {merge:true});
      onClose();
    } catch(error) {
      console.error("Error saving category:", error);
  }
    
      console.log("Saving:", {name:categoryName, color: categoryColor});

}
  const handleColorChange = (color) => {
    setCategoryColor(color.hex);
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-gray-800 text-white shadow-xl p-8 w-full max-w-sm rounded-lg'>
      <h2 className='text-2xl font-bold mb-6'>Create New Category</h2>
      <div className='mb-4'>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-400 mb-1' htmlFor='categoryName'>Category Name</label>
          <input className='w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type='text' id='categoryName' value={categoryName} onChange={(e)=>{setCategoryName(e.target.value)}}></input>
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-400 mb-1' htmlFor='categoryColor'>Category Color</label>
          <CirclePicker color={categoryColor} onChangeComplete={handleColorChange}/>
        </div>
      </div>
      <div className='flex justify-end gap-4'>
      <button className='px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors' onClick={handleSave} >Save</button>
      <button className='px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors' onClick={onClose}>Cancel</button>
      </div>
      </div>
      </div>
  )
}

function TimerView({ user }) {
  const [timerMode, setTimerMode] = useState('focus'); 
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFlowMode, setIsFlowMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionEndTime, setSessionEndTime] = useState(null);
  
  
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

  useEffect(() => {
    if(!user) {
      setCategories([]);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().categories) {
        setCategories(docSnap.data().categories);
      } else {
        setCategories([]);
      }
    });

    return unsubscribe;
  },  [user]);

  const handleStart = () => { if (time > 0 || timerMode === 'focus') { setIsActive(true); } };
  const handlePause = () => { setIsActive(false); };
  const handleReset = () => {
    setIsActive(false);
    setIsFlowMode(false);
    switchMode(timerMode); 
  };
  const handleOpenModal = () => {setIsModalOpen(true)};
  const handleCloseModal = () => {setIsModalOpen(false)};
  const handleSelectCategory = (category) => {
    if (selectedCategory?.name === category.name) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  }
  



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
    <>
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


  {/* The Focus Shelf */}
  <div className="w-full max-w-md mx-auto mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
    

    <div className="flex items-start gap-4 justify-center ">
      {categories.map((category) => (
        <div key={category.name} className={`flex flex-col items-center gap-2 w-20 ${selectedCategory?.name === category.name ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
          <button onClick={() => handleSelectCategory(category)} 
            className='w-8 h-8 m-2 rounded-full shadow-md transition-all hover:scale-110 hover:shadow-lg' 
            style={{
              backgroundColor: category.color, 
              boxShadow: `0 0 10px ${category.color}`
            }}
          ></button>
          <span className='text-gray-300 text-sm text-center'>{category.name}</span>
        </div>
      ))}
    </div>


    <div className='flex justify-center mt-4'>
      <button className='flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-600 rounded-full text-gray-600 hover:border-gray-500 hover:text-gray-500 transition-colors' onClick={handleOpenModal}>
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>

</div>
    {isModalOpen && <AddCategoryModal onClose={handleCloseModal} user={user} existingCategories={categories}/>}
    </>

  );
}

export default TimerView;