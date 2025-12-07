require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// theMarketer subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, firstname, gdpr_consent } = req.body;
    
    // Validation
    if (!email || !firstname) {
      return res.status(400).json({
        success: false,
        error: 'Email and firstname are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Check if theMarketer credentials are configured
    if (!process.env.THEMARKETER_CUSTOMER_KEY || !process.env.THEMARKETER_REST_KEY) {
      console.error('theMarketer credentials not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }
    
    // theMarketer API only accepts GET requests with params in URL
    // Build complete URL with all parameters
    const params = new URLSearchParams({
      k: process.env.THEMARKETER_CUSTOMER_KEY,
      u: process.env.THEMARKETER_REST_KEY,
      email_address: email,
      firstname: firstname,
      subscribe_newsletter: gdpr_consent ? '1' : '0'
    });
    
    const theMarketerEndpoint = 'https://t.themarketer.com/api/v1/opt_in_settings/save';
    const fullUrl = `${theMarketerEndpoint}?${params.toString()}`;
    
    console.log('Sending to theMarketer (GET):', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Handle theMarketer response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('theMarketer API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return res.status(response.status).json({
        success: false,
        error: 'Failed to subscribe to newsletter'
      });
    }
    
    const data = await response.json();
    
    // Check if theMarketer returned success
    if (data.status === 'success' || data.success === true) {
      console.log('Successfully subscribed:', email);
      return res.json({
        success: true,
        message: 'Successfully subscribed'
      });
    } else {
      console.error('theMarketer returned unsuccessful response:', data);
      return res.status(400).json({
        success: false,
        error: 'Subscription failed'
      });
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Giveaway API server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`);
});

module.exports = app;
