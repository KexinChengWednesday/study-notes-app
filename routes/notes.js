// routes/notes.js
const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// Create Note
router.post('/', async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.status(201).send(note);
});

// Get all notes by user
router.get('/:uid', async (req, res) => {
  const notes = await Note.find({ uid: req.params.uid }).sort({ createdAt: -1 });
  res.send(notes);
});

// Update note
router.put('/:id', async (req, res) => {
  const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updated);
});

// Delete note
router.delete('/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.send({ message: 'Note deleted' });
});

module.exports = router;
