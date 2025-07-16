// client/src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Create a state variable to hold the message from the server.
  // It starts as an empty string.
  const [message, setMessage] = useState('');

  // 2. Use useEffect to run code once when the component loads.
  // The empty array [] at the end means "only run this once".
  useEffect(() => {
    // 3. Use the built-in 'fetch' function to make a request to our server's URL.
    fetch('http://localhost:5001/api/test')
      .then(res => res.json()) // Take the response and turn it into JSON
      .then(data => setMessage(data.message)); // Take the JSON data and set our message state
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>FlowPomodor</h1>
        {/* 4. Display the message from our state. It will be empty at first,
            then it will update once the data arrives from the server. */}
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;