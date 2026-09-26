const express = require('express');
const router = express.Router();
const { sendMessage, getHistory } = require('../controllers/legalChatController');
const protect = require('../middleware/authMiddleware');

router.post('/message', protect, sendMessage);
router.get('/history', protect, getHistory);

module.exports = router;