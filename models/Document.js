const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

const documentSchema = new mongoose.Schema({
  filename: String,
  originalText: String,
  chunks: [String],
  qaHistory: [qaSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);