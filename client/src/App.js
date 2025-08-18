// client/src/App.js

import React, { useState, useEffect, Component } from 'react';
import { auth, googleProvider, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import Header from './Header';
import TimerView from './TimerView';
import DashboardView from './DashboardView';
import SettingsView from './SettingsView';
import './App.css';
import { doc, onSnapshot } from 'firebase/firestore';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-md">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-red-400 mb-4">The app encountered an unexpected error.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); // We add a loading state
  const [view, setView] = useState('timer');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const isProUser = false;

  // Your corrected useEffect listener!
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setError(null);
      // If the user logs out, always return to the timer view
      if (!user) {
        setView('timer');
      }
    }, (error) => {
      console.error("Auth error:", error);
      setError("Authentication failed");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().categories) {
          setCategories(docSnap.data().categories);
        } else {
          setCategories([]);
        }
        setError(null);
      }, (error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load user data");
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up categories listener:", error);
      setError("Failed to connect to database");
    }
  }, [user]);


  // Your handleLogin function!
  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Login failed. Please try again.");
    }
  };

  // Your handleLogout function!
  const handleLogout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed. Please try again.");
    }
  };

  // While Firebase is checking the auth state, show a loading message.
  if (loading) {
    return <div className="text-white text-center p-10">Loading App...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {/* We now pass the login/logout functions down to the Header */}
        <Header 
          user={user} 
          setView={setView} 
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        
        <main className='w-full'>
          {view === 'timer' && <TimerView user={user} categories={categories} isProUser={isProUser} />} 
          {view === 'dashboard' && <DashboardView user={user} categories={categories} isProUser={isProUser} />}
          {view === 'settings' && <SettingsView user={user} categories={categories} isProUser={isProUser} />}
          {/* We'll add the other views later */}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;