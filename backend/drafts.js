const express = require('express');
const router = express.Router();
const Draft = require('./Draft');

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

// GET all drafts for a user
router.get('/', extractUserId, async (req, res) => {
  const userId = req.userId;
  try {
    const drafts = await Draft.find({ userId }).sort({ createdAt: -1 }); // Sort by date, descending
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new draft
router.post('/create', extractUserId, async (req, res) => {
  const { title, content, category } = req.body;
  const userId = req.userId; // Access userId here

  const draft = new Draft({
    userId,
    title,
    content,
    category
  });

  try {
    const newDraft = await draft.save();
    res.status(201).json(newDraft);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', extractUserId, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Find the draft by id and ensure it belongs to the current user
    const draft = await Draft.findOne({ _id: id, userId });

    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    res.status(200).json(draft);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT route to update an existing draft
router.put('/:id', extractUserId, async (req, res) => {
  const { id } = req.params;
  const { title, content, category, favourited, daily } = req.body; // Include favourited
  const userId = req.userId;
  const updatedAt = Date.now(); 
  

  try {
    // Find the draft by id and ensure it belongs to the current user
    const draft = await Draft.findOneAndUpdate(
      { _id: id, userId }, // Ensure the draft belongs to the user
      { title, content, category, favourited, updatedAt, daily }, // Update fields
      { new: true } // Return the updated document
    
    );

    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    res.status(200).json(draft);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
