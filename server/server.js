// server/server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.json());
app.use(cors());

const PORT =  process.env.PORT || 5001;


app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server!' });
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
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}?payment=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}`,
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
    return;
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});