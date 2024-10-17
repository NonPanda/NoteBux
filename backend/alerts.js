const express = require('express');
const router = express.Router();
const Alert = require('./Alert');

// Middleware to extract userId from the Authorization token
const extractUserId = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }
  
  req.userId = token; // Set userId
  next();
};

// GET all alerts for a user
router.get('/', extractUserId, async (req, res) => {
  const userId = req.userId;
  try {
    const alerts = await Alert.find({ user: userId }).sort({ createdAt: -1 }); // Sort by date, descending
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new alert
// POST a new alert
router.post('/', extractUserId, async (req, res) => {
  const { content, time, totalTime } = req.body; // Get content, time, and totalTime from request body
  const userId = req.userId; // Access userId here

  const alert = new Alert({
    content,
    time,
    user: userId, // Link alert to the user
    totalTime // Include totalTime when saving
  });

  try {
    const newAlert = await alert.save();
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// GET a specific alert by id
router.get('/:id', extractUserId, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Find the alert by id and ensure it belongs to the current user
    const alert = await Alert.findOne({ _id: id, user: userId });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT route to update an existing alert
router.put('/:id', extractUserId, async (req, res) => {
  const { id } = req.params;
  const { content, time } = req.body; // Include content and time
  const userId = req.userId;

  try {
    // Find the alert by id and ensure it belongs to the current user
    const alert = await Alert.findOneAndUpdate(
      { _id: id, user: userId }, // Ensure the alert belongs to the user
      { content, time }, // Update fields
      { new: true } // Return the updated document
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an alert
router.delete('/:id', extractUserId, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const alert = await Alert.findOneAndDelete({ _id: id, user: userId }); // Ensure the alert belongs to the user

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
