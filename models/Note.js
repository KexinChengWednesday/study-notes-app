// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  uid: String,
  title: String,
  content: String,
  tag: String,
  pinned: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
