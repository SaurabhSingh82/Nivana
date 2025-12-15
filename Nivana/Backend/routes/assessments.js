const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assessments');
const auth = require('../middleware/auth');

// START assessment (questions)
router.post('/start', ctrl.startAssessment);

// SUBMIT assessment (SAVE)
router.post('/submit', auth, ctrl.submitAssessment);

// HISTORY
router.get('/history', auth, ctrl.getHistory);

module.exports = router;
