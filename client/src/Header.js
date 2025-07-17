import React from 'react';

function Header({ user, setView, onLogin, onLogout }) {
  return (
    <header className="App-header">
      <h1>FlowPomodor</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={onLogin}>Login with Google</button>
      )}
      <button onClick={() => setView('timer')}>Timer</button>
      {user && <button onClick={() => setView('dashboard')}>Dashboard</button>}
      {user && <button onClick={() => setView('settings')}>Settings</button>}
      {user && <button onClick={() => setView('history')}>History</button>}
    </header>
  );
}
export default Header;