const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function(db) {
  const router = express.Router();

  // Register route
  router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    try {
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (user) return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
          if (err) return res.status(500).json({ message: 'Server error' });
          res.status(201).json({ message: 'User registered successfully' });
        });
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Login route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    try {
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
}; 