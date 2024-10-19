
const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {type: String},
  favourited: { type: Boolean, default: false }, // New field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  daily: { type: Boolean, default: false },
  description: { type: String }
});

draftSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('content') || this.isModified('category') || this.isModified('favourited')|| this.isModified('daily')|| this.isModified('description')) {
    this.updatedAt = Date.now();
  }
  next();
});


const Draft = mongoose.model('Draft', draftSchema);

module.exports = Draft;
