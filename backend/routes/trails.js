const express = require('express');
const router = express.Router();

// Get all trails
router.get('/', (req, res) => {
  res.json({
    message: 'Get all trails',
    trails: [
      {
        id: 1,
        name: 'Sample Trail',
        location: 'Sample Location',
        difficulty: 'Medium',
        distance: '5 miles',
        rating: 4.5
      }
    ]
  });
});

// Get single trail
router.get('/:id', (req, res) => {
  res.json({
    message: `Get trail ${req.params.id}`,
    trail: {
      id: req.params.id,
      name: 'Sample Trail',
      location: 'Sample Location',
      difficulty: 'Medium',
      distance: '5 miles',
      description: 'Beautiful trail with scenic views',
      rating: 4.5,
      coordinates: { lat: 0, lng: 0 }
    }
  });
});

// Create new trail
router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Trail created',
    trail: req.body
  });
});

// Update trail
router.put('/:id', (req, res) => {
  res.json({
    message: `Trail ${req.params.id} updated`,
    trail: req.body
  });
});

// Delete trail
router.delete('/:id', (req, res) => {
  res.json({ message: `Trail ${req.params.id} deleted` });
});

module.exports = router;
