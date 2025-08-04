// client/src/App.js

import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import Header from './Header';
import TimerView from './TimerView';
import DashboardView from './DashboardView';
import SettingsView from './SettingsView';
import './App.css';

function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); // We add a loading state
  const [view, setView] = useState('timer');

  // Your corrected useEffect listener!
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      // If the user logs out, always return to the timer view
      if (!user) {
        setView('timer');
      }
    });
    return unsubscribe;
  }, []);

  // Your handleLogin function!
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  // Your handleLogout function!
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // While Firebase is checking the auth state, show a loading message.
  if (loading) {
    return <div>Loading App...</div>;
  }

  return (
    <div className="App">
      {/* We now pass the login/logout functions down to the Header */}
      <Header 
        user={user} 
        setView={setView} 
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main className='w-full'>
        {view === 'timer' && <TimerView user={user} />} 
        {view === 'dashboard' && <DashboardView user={user} />}
        {view === 'settings' && <SettingsView user={user} />}
        {/* We'll add the other views later */}
      </main>
    </div>
  );
}

export default App;