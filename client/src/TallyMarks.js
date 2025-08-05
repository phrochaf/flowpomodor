import React from 'react';

const calculateTallys = (totalMinutes) => {
    const fullSets = Math.floor(totalMinutes / 5);
    const remainingMarks = totalMinutes % 5;
    return { fullSets, remainingMarks };
}

function SingleTallyMark() {
    return (
      <svg 
        className="w-8 h-8" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="16" y1="2" x2="16" y2="28" />
      </svg>
    );
  }
  

  function FullTallyMark() {
    return (
      <svg 
        className="w-8 h-8" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="6" y1="4" x2="6" y2="28" />
        <line x1="12" y1="4" x2="12" y2="28" />
        <line x1="18" y1="4" x2="18" y2="28" />
        <line x1="24" y1="4" x2="24" y2="28" />
        <line x1="2" y1="28" x2="28" y2="4" />
      </svg>
    );
  }
  


const TallyMarks = ({ elapsedTime }) => {
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    const { fullSets, remainingMarks } = calculateTallys(elapsedMinutes);
    return (
        <div className="flex items-center justify-center text-white">
            {[...Array(fullSets)].map((_,index) => (<span key={index} className="text-2xl m-2"><FullTallyMark /></span>))}
            <div className="flex text-white">
                {[...Array(remainingMarks)].map((_,index) => (<span key={index} className="p-0 m-0"><SingleTallyMark/></span>))}
            </div>
        </div>
    )
}

export default TallyMarks;