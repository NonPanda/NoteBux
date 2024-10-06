const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  time: {
    type: String, // Storing time as a string in format "HH:MM:SS"
    required: true,
  },
  user: {
    type: String, // Or mongoose.Schema.Types.ObjectId if linked to a User model
    required: true,
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
