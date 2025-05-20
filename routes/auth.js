// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).send({ message: 'User registered' });
  } catch (err) {
    res.status(400).send({ error: 'Registration failed', details: err });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).send({ error: 'Invalid email' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).send({ error: 'Invalid password' });

  res.send({ message: 'Login successful', email: user.email });
});

module.exports = router;
