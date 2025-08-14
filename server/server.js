// server/server.js

// 0. Import the .env file
require('dotenv').config();

// 1. Import the packages we installed
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 2. Create an instance of an Express application
const app = express();

// 3. Define the port the server will run on
const PORT = 5001;


// 4. Use the CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// 4. Middleware to parse JSON bodies
app.use(express.json());

// 5. Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// 6. Define a simple test route
// This means if someone visits http://localhost:5000/api/test,
// we'll send back a JSON message.
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// 7. Start the server and make it listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl', // Brazilian Real
          product_data: {
            name: 'FlowPomodor Pro',
          },
          unit_amount: 1000, // Price in cents (e.g., 1000 = R$10.00)
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/',
      cancel_url: 'http://localhost:3000/',
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
    return;
  }
});

// 8. Start the server and make it listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});