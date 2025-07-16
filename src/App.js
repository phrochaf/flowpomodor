// client/src/App.js

import React, { useState, useEffect } from 'react';
import Header from './Header';
import TimerView from './TimerView';
import './App.css';

function App() {

  const[user, setUser] = useState({null});
  const[view, setView] = useState('timer');

  useEffect(() => {
    // TODO: Add Firebase onAuthStateChanged listener
  }, []);

  return (
    <div className="App">
      <Header user={user} setView={setView} />
      <main>
        {/* View state to choose the component to render */}
        {view === 'timer' && <TimerView user={user} />}
        {user && view ==='dashboard' && <div>Dashboard (soon...)</div>}
        {user && view ==='settings' && <div>Settings (soon...)</div>}
      </main>
    </div>
  );
} export default App;