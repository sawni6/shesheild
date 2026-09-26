const express = require('express');
const router = express.Router();
const {
  triggerSOS,
  updateLiveLocation,
  getIncidentHistory,
  getAllIncidents,
  getActiveIncident,
} = require('../controllers/sosController');
const protect = require('../middleware/authMiddleware');

router.post('/trigger', protect, triggerSOS);
router.post('/update-location', protect, updateLiveLocation);
router.get('/active', protect, getActiveIncident);
router.get('/history', protect, getIncidentHistory);
router.get('/all', protect, getAllIncidents);

module.exports = router;