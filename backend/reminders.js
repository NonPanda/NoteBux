const express = require('express');
const router = express.Router();
const Reminder = require('./Reminder');
const moment = require('moment');


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

// Middleware to reset dismissed state at the start of a new day
const resetDismissedReminders = async (req, res, next) => {
  const currentDay = moment().startOf('day');
  try {
    await Reminder.updateMany(
      { dismissed: true, time: { $lt: currentDay } }, // Find reminders that were dismissed
      { dismissed: false } // Reset dismissed state to false
    );
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error resetting dismissed reminders' });
  }
};

// GET all reminders for a user
router.get('/', extractUserId, resetDismissedReminders, async (req, res) => {
  const userId = req.userId;
  try {
    const reminders = await Reminder.find({ user: userId }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new reminder
router.post('/', extractUserId, async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;
  const reminder = new Reminder({
    content,
    time: new Date(),
    user: userId,
  });

  try {
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT route to update an existing reminder (for dismissal)
router.put('/:id', extractUserId, async (req, res) => {
  const { id } = req.params;
  const { dismissed } = req.body;
  const userId = req.userId;

  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, user: userId },
      { dismissed },
      { new: true }
    );
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.status(200).json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a reminder
router.delete('/:id', extractUserId, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const reminder = await Reminder.findOneAndDelete({ _id: id, user: userId });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
