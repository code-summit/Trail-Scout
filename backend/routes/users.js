const express = require('express');
const router = express.Router();

// User registration
router.post('/register', (req, res) => {
  res.status(201).json({
    message: 'User registered',
    user: {
      id: 1,
      username: req.body.username,
      email: req.body.email
    }
  });
});

// User login
router.post('/login', (req, res) => {
  res.json({
    message: 'User logged in',
    token: 'jwt-token-here'
  });
});

// Get user profile
router.get('/profile/:id', (req, res) => {
  res.json({
    message: `Get user ${req.params.id}`,
    user: {
      id: req.params.id,
      username: 'username',
      email: 'user@example.com',
      bio: 'Hiking enthusiast',
      trailsCompleted: 0,
      joinedDate: new Date()
    }
  });
});

// Update user profile
router.put('/profile/:id', (req, res) => {
  res.json({
    message: `User ${req.params.id} profile updated`,
    user: req.body
  });
});

module.exports = router;
