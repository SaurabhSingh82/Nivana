const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const auth = require('../middleware/auth'); 

// POST /api/moods
router.post('/', auth, async (req, res) => {
  try {
    const { mood, score, date } = req.body;
    
    // Create new mood
    const newMood = new Mood({
      userId: req.user.id,
      mood,
      score,
      createdAt: date || Date.now()
    });

    const savedMood = await newMood.save();
    res.json(savedMood);
  } catch (err) {
    console.error("Error saving mood:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;