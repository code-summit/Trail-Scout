const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const corsOptions = {
  origin: [
    'https://lighthearted-stroopwafel-95a8e1.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Agent-Id']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Trail Scout API is running' });
});

// Voice agent routes
app.use('/api/voice', require('./routes/voice'));

// Trail routes
app.use('/api/trails', require('./routes/trails'));

// User routes
app.use('/api/users', require('./routes/users'));

// Review routes
app.use('/api/reviews', require('./routes/reviews'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Trail Scout API running on port ${PORT}`);
});
