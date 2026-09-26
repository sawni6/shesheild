const Incident = require('../models/Incident');
const User = require('../models/User');
const { generateIncidentSummary } = require('../services/geminiService');
const triggerSOS = async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    const userId = req.userId;
    const incident = await Incident.create({
      userId,
      location: { lat, lng, address },
      status: 'active',
    });
    const aiResult = await generateIncidentSummary({
      lat, lng, address,
      timestamp: incident.createdAt,
    });
    incident.aiSeverity = aiResult.severity;
    incident.aiSummary = aiResult.summary;
    await incident.save();
    const user = await User.findById(userId);
    const emergencyContacts = user.emergencyContacts;
    const io = req.app.get('io');
    io.emit('sos-alert', {
      incidentId: incident._id,
      userId,
      location: incident.location,
      severity: incident.aiSeverity,
      summary: incident.aiSummary,
      timestamp: incident.createdAt,
      notifiedContacts: emergencyContacts,
    });
    res.status(201).json({
      success: true,
      message: 'SOS triggered successfully',
      incident,
      notifiedContacts: emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateLiveLocation = async (req, res) => {
  try {
    const { incidentId, lat, lng } = req.body;
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    incident.locationHistory.push({ lat, lng });
    incident.location.lat = lat;
    incident.location.lng = lng;
    await incident.save();
    const io = req.app.get('io');
    io.emit('location-update', { incidentId, lat, lng, timestamp: new Date() });
    res.status(200).json({ success: true, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getIncidentHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const incidents = await Incident.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({})
      .select('location aiSeverity createdAt status')
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getActiveIncident = async (req, res) => {
  try {
    const userId = req.userId;

    const incident = await Incident.findOne({
      userId,
      status: 'active',
    }).sort({ createdAt: -1 });

    // No active incident is not a server error
    if (!incident) {
      return res.status(200).json({
        success: true,
        incident: null,
        message: 'No active incident found',
      });
    }

    return res.status(200).json({
      success: true,
      incident,
    });
  } catch (error) {
    console.error('Get active incident error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  triggerSOS,
  updateLiveLocation,
  getIncidentHistory,
  getAllIncidents,
  getActiveIncident,
}; 