// models/Draft.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Draft Schema
const draftSchema = new Schema({
  userId: {
    type: String, // Google User ID
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Draft', draftSchema);
