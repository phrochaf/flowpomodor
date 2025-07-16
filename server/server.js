// server/server.js

// 1. Import the packages we installed
const express = require('express');
const cors = require('cors');

// 2. Create an instance of an Express application
const app = express();

// 3. Define the port the server will run on
const PORT = 5001; // We'll use 5000 to avoid conflict with React's 3000

// 4. Use the CORS middleware
app.use(cors());

// 5. Define a simple test route
// This means if someone visits http://localhost:5000/api/test,
// we'll send back a JSON message.
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// 6. Start the server and make it listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});