const express = require('express');
const router = express.Router();
const { register, login } = require('../services/authService');

router.post('/register', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = register(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const result = login(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
