import React, { useState, useEffect } from 'react';
import Header from './Header';
import TimerView from './TimerView';
import './App.css';

function App() {
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('timer');

  useEffect(() => { /* Firebase logic will go here */ }, []);

  return (
    <div className="App">
      <Header user={user} setView={setView} />
      <main>
        {view === 'timer' && <TimerView user={user} />}
      </main>
    </div>
  );
}
export default App;