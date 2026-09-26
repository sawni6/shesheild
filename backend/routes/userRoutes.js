const express = require('express');
const router = express.Router();
const {
  addEmergencyContact,
  getEmergencyContacts,
  deleteEmergencyContact,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.post('/emergency-contacts', protect, addEmergencyContact);
router.get('/emergency-contacts', protect, getEmergencyContacts);
router.delete('/emergency-contacts/:contactId', protect, deleteEmergencyContact);

module.exports = router;