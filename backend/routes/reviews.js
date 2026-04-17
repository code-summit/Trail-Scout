const express = require('express');
const router = express.Router();

// Get reviews for a trail
router.get('/trail/:trailId', (req, res) => {
  res.json({
    message: `Get reviews for trail ${req.params.trailId}`,
    reviews: [
      {
        id: 1,
        trailId: req.params.trailId,
        username: 'User',
        rating: 5,
        comment: 'Great trail!',
        date: new Date()
      }
    ]
  });
});

// Create review
router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Review created',
    review: req.body
  });
});

// Update review
router.put('/:id', (req, res) => {
  res.json({
    message: `Review ${req.params.id} updated`,
    review: req.body
  });
});

// Delete review
router.delete('/:id', (req, res) => {
  res.json({ message: `Review ${req.params.id} deleted` });
});

module.exports = router;
