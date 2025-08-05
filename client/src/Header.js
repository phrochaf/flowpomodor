// client/src/Header.js

import React from 'react';

function Header({ user, setView, onLogin, onLogout }) {
  const secondaryButtonClassName = 'px-3 py-1 text-sm font-semibold rounded-full text-gray-300 hover:bg-gray-700 transition-colors';

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center w-full pb-4 border-b border-gray-600">
      
      {/* Column 1: Title and Icon */}
      <div className="justify-self-start flex items-center">
      <svg className='w-7 h-7 text-red-500 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
      <h1 className="text-2xl font-bold text-gray-200">FlowPomodor</h1>
      </div>
      
      {/* Column 2: Navigation */}
      <nav className="justify-self-center flex items-center gap-2">
        <button className={secondaryButtonClassName} onClick={() => setView('timer')}>Timer</button>
        {user && <button className={secondaryButtonClassName} onClick={() => setView('dashboard')}>Dashboard</button>}
        {user && <button className={secondaryButtonClassName} onClick={() => setView('settings')}>Settings</button>}
      </nav>

      {/* Column 3: Login/Logout */}
      <div className="justify-self-end flex justify-end items-center" style={{ minWidth: '200px' }}>  
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, {user.displayName}!</span>
            <button className={secondaryButtonClassName} onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <button 
            className='px-4 py-2 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors' 
            onClick={onLogin}
          >
            Login with Google
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;