const express = require('express');
const router = express.Router();
const Draft = require('./Draft');

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

router.get('/', extractUserId, async (req, res) => {
  const userId = req.userId;
  try {
    const drafts = await Draft.find({ userId }).sort({ createdAt: -1 }); // Sort by date, descending
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/create', extractUserId, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId; // Access userId here

  const draft = new Draft({
    userId,
    title,
    content
  });

  try {
    const newDraft = await draft.save();
    res.status(201).json(newDraft);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
